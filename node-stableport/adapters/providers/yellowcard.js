require('dotenv').config();
const axios = require('axios');
const { v4: uuid } = require('uuid');
const crypto = require('crypto-js');

/**
 * Yellowcard Exchange Adapter
 * 
 * This adapter implements the Yellowcard API integration for the Stableport platform.
 * It handles authentication, quote retrieval, and payment processing through the Yellowcard platform.
 */
class YellowcardAdapter {
  constructor(config) {
    this.config = config || {};
    this.apiKey = process.env.YELLOWCARD_API_KEY || this.config.apiKey;
    this.secretKey = process.env.YELLOWCARD_API_SECRET || this.config.secretKey;
    this.baseURL = process.env.YELLOWCARD_API_URL || 'https://sandbox.api.yellowcard.io';
    
    // Initialize axios instance
    this.api = axios.create({
      baseURL: this.baseURL
    });
    
    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        const hash = this.createAuthHeaders(config.url, config.method.toUpperCase(), config.data);
        config.headers['Authorization'] = hash['Authorization'];
        config.headers['X-YC-Timestamp'] = hash['X-YC-Timestamp'];
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );
  }
  
  /**
   * Create authentication headers for Yellowcard API
   * @param {string} path - API endpoint path
   * @param {string} method - HTTP method
   * @param {object} body - Request body
   * @returns {object} Authentication headers
   */
  createAuthHeaders(path, method, body) {
    const date = new Date().toISOString();
    const hmac = crypto.algo.HMAC.create(crypto.algo.SHA256, this.secretKey);

    hmac.update(date, 'utf8');
    hmac.update(path, 'utf8');
    hmac.update(method, 'utf8');

    if (body) {
      let bodyHmac = crypto.SHA256(JSON.stringify(body)).toString(crypto.enc.Base64);
      hmac.update(bodyHmac);
    }

    const hash = hmac.finalize();
    const signature = crypto.enc.Base64.stringify(hash);

    return {
      "X-YC-Timestamp": date,
      "Authorization": `YcHmacV1 ${this.apiKey}:${signature}`
    };
  }
  
  /**
   * Get available channels, networks, and rates
   * @returns {Promise<object>} Available payment options
   */
  async getPaymentOptions() {
    try {
      const [channelData, networkData, ratesData] = await Promise.all([
        this.api.get('/business/channels').then(res => res.data),
        this.api.get('/business/networks').then(res => res.data),
        this.api.get('/business/rates').then(res => res.data)
      ]);
      
      return {
        channels: channelData.channels, 
        networks: networkData.networks, 
        rates: ratesData.rates
      };
    } catch (error) {
      console.error('Error fetching Yellowcard payment options:', error);
      throw new Error(`Failed to fetch payment options: ${error.message}`);
    }
  }
  
  /**
   * Get quote for currency conversion
   * @param {object} params - Quote parameters
   * @param {number} params.netFiatAmount - Amount in fiat to deliver
   * @param {string} params.currency - Currency code (e.g., 'NGN', 'AED')
   * @param {string} params.direction - 'buy' for USDC->Fiat, 'sell' for Fiat->USDC
   * @returns {Promise<object>} Quote information
   */
  async getQuote(params) {
    try {
      const { netFiatAmount, currency, direction } = params;
      
      // Get available payment options
      const { channels, networks, rates } = await this.getPaymentOptions();
      
      // Find matching currency rate
      const currencyRate = rates.find(r => r.code === currency);
      if (!currencyRate) {
        throw new Error(`Currency ${currency} not supported`);
      }
      
      // Calculate USDC amount based on direction
      let usdcAmount, fiatAmount;
      if (direction === 'buy') {
        // Converting USDC to fiat
        usdcAmount = netFiatAmount / currencyRate.sell;
        fiatAmount = netFiatAmount;
      } else {
        // Converting fiat to USDC
        usdcAmount = netFiatAmount / currencyRate.buy;
        fiatAmount = netFiatAmount;
      }
      
      // Apply fees (simplified - in real implementation this would use actual API fee data)
      const fee = usdcAmount * 0.01; // Example: 1% fee
      const totalUsdcAmount = direction === 'buy' ? usdcAmount + fee : usdcAmount;
      
      return {
        usdcRequired: parseFloat(totalUsdcAmount.toFixed(2)),
        fiatAmount: parseFloat(fiatAmount.toFixed(2)),
        fiatCurrency: currency,
        fee: parseFloat(fee.toFixed(2)),
        rate: direction === 'buy' ? currencyRate.sell : currencyRate.buy
      };
    } catch (error) {
      console.error('Error getting quote from Yellowcard:', error);
      throw new Error(`Failed to get quote: ${error.message}`);
    }
  }
  
  /**
   * Validate bank account details
   * @param {object} params - Bank account details
   * @param {string} params.accountNumber - Recipient's account number
   * @param {string} params.networkId - Network ID for the bank
   * @returns {Promise<object>} Validated account details
   */
  async validateBankAccount(params) {
    try {
      const { accountNumber, networkId } = params;
      
      const { data } = await this.api.post('/business/details/bank', {
        accountNumber,
        networkId
      });
      
      return data;
    } catch (error) {
      console.error('Error validating bank account with Yellowcard:', error);
      throw new Error(`Failed to validate bank account: ${error.message}`);
    }
  }
  
  /**
   * Submit payment request
   * @param {object} params - Payment parameters
   * @param {string} params.recipientAccountId - Recipient's account ID
   * @param {number} params.recipientAmount - Amount to deliver in fiat
   * @param {string} params.recipientCurrency - Currency code to deliver
   * @param {string} params.reason - Payment reason
   * @param {object} params.senderDetails - Sender's details
   * @returns {Promise<object>} Payment response
   */
  async submitPayment(params) {
    try {
      const { 
        recipientAccountId, 
        recipientAmount, 
        recipientCurrency, 
        reason = 'business_payment',
        senderDetails 
      } = params;
      
      // Get available payment options
      const { channels, networks, rates } = await this.getPaymentOptions();
      
      // Find active withdrawal channel for the currency
      const activeChannels = channels.filter(
        c => c.status === 'active' && 
        c.rampType === 'withdraw' && 
        c.currency === recipientCurrency
      );
      
      if (activeChannels.length === 0) {
        throw new Error(`No active channels found for ${recipientCurrency}`);
      }
      
      // Select the first available channel
      const channel = activeChannels[0];
      
      // Find supported networks for this channel
      const supportedNetworks = networks.filter(
        n => n.status === 'active' && n.channelIds.includes(channel.id)
      );
      
      if (supportedNetworks.length === 0) {
        throw new Error(`No supported networks found for channel ${channel.id}`);
      }
      
      // Select the first available network
      const network = supportedNetworks[0];
      
      // Create destination object
      const destination = {
        accountNumber: recipientAccountId,
        accountType: network.accountNumberType,
        country: network.country,
        networkId: network.id,
        accountBank: network.code
      };
      
      // Validate recipient account
      try {
        const destinationConf = await this.validateBankAccount({
          accountNumber: destination.accountNumber,
          networkId: destination.networkId
        });
        
        destination.accountName = destinationConf.accountName;
      } catch (error) {
        console.warn('Account validation failed, proceeding without account name:', error.message);
      }
      
      // Get currency rate
      const currencyRate = rates.find(r => r.code === recipientCurrency);
      if (!currencyRate) {
        throw new Error(`Currency ${recipientCurrency} not supported`);
      }
      
      // Calculate USD amount based on local amount
      const amountUSD = recipientAmount / currencyRate.sell;
      
      // Create payment request
      const request = {
        sequenceId: uuid(),
        channelId: channel.id,
        currency: channel.currency,
        country: channel.country,
        amount: parseFloat(amountUSD.toFixed(2)), // Amount in USD
        reason,
        destination,
        sender: {
          name: senderDetails.name || "Stableport User",
          country: senderDetails.country || "US",
          phone: senderDetails.phone || "+12222222222",
          address: senderDetails.address || "Sample Address",
          dob: senderDetails.dob || "01/01/1990",
          email: senderDetails.email || "user@stableport.com",
          idNumber: senderDetails.idNumber || "0123456789",
          idType: senderDetails.idType || "license"
        },
        forceAccept: true
      };
      
      // Submit payment request
      const { data } = await this.api.post('/business/payments', request);
      
      return {
        externalId: data.id,
        status: data.status,
        senderAmount: recipientAmount / currencyRate.buy, // Approximate sender amount
        senderCurrency: recipientCurrency, // Using same currency for simplicity
        recipientAmount,
        recipientCurrency,
        usdcAmount: amountUSD,
        metadata: data
      };
    } catch (error) {
      console.error('Error submitting payment to Yellowcard:', error);
      throw new Error(`Failed to submit payment: ${error.message}`);
    }
  }
  
  /**
   * Get transaction status
   * @param {string} transactionId - External transaction ID
   * @returns {Promise<object>} Transaction status
   */
  async getTransactionStatus(transactionId) {
    try {
      const { data } = await this.api.get(`/business/payments/${transactionId}`);
      
      return {
        externalId: data.id,
        status: this.mapStatus(data.status),
        metadata: data
      };
    } catch (error) {
      console.error('Error getting transaction status from Yellowcard:', error);
      throw new Error(`Failed to get transaction status: ${error.message}`);
    }
  }
  
  /**
   * Map Yellowcard status to Stableport status
   * @param {string} yellowcardStatus - Status from Yellowcard API
   * @returns {string} Stableport status
   */
  mapStatus(yellowcardStatus) {
    const statusMap = {
      'pending': 'processing',
      'completed': 'completed',
      'failed': 'failed',
      'cancelled': 'cancelled'
    };
    
    return statusMap[yellowcardStatus.toLowerCase()] || 'processing';
  }
}

module.exports = YellowcardAdapter;