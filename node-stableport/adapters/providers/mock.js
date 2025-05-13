const { v4: uuid } = require('uuid');

/**
 * Mock Exchange Adapter
 * 
 * This adapter implements a mock version of an exchange partner API for development and testing.
 * It simulates quote retrieval, payment processing, and transaction status updates.
 */
class MockAdapter {
  constructor(config) {
    this.config = {
      exchangeId: 'mock_exchange',
      name: 'Mock Exchange',
      country: 'UG',
      currency: 'UGX',
      ...config
    };
    
    // Simulated exchange rates against USD/USDC
    this.rates = {
      'UGX': { buy: 3600, sell: 3650 },  // UGX to USD rate
      'AED': { buy: 3.65, sell: 3.68 },  // AED to USD rate
      'USD': { buy: 0.99, sell: 1.01 }   // USD to USDC rate (accounting for small spread)
    };
    
    // Store mock transactions
    this.transactions = {};
  }
  
  /**
   * Get quote for currency conversion
   * @param {object} params - Quote parameters
   * @param {number} params.netFiatAmount - Fiat amount to deliver (for 'buy' direction)
   * @param {string} params.currency - Currency code (e.g., 'UGX', 'AED')
   * @param {string} params.direction - 'buy' for USDC->Fiat, 'sell' for Fiat->USDC
   * @param {number} params.usdcAmount - USDC amount (for 'sell' direction)
   * @returns {Promise<object>} Quote information
   */
  async getQuote(params) {
    const { 
      netFiatAmount, 
      currency = this.config.currency, 
      direction = 'buy',
      usdcAmount 
    } = params;
    
    // Get exchange rate for the currency
    const rate = this.rates[currency] || { buy: 1, sell: 1 };
    
    // Calculate amounts based on direction
    let finalUsdcAmount, finalFiatAmount;
    
    if (direction === 'buy') {
      // USDC -> Fiat (recipient's perspective)
      if (!netFiatAmount) {
        throw new Error('Net fiat amount is required for buy direction');
      }
      
      // Calculate USDC required to deliver netFiatAmount of fiat
      finalUsdcAmount = netFiatAmount / rate.sell;
      finalFiatAmount = netFiatAmount;
    } else {
      // Fiat -> USDC (sender's perspective)
      if (usdcAmount) {
        // Calculate how much fiat is needed to get usdcAmount
        finalUsdcAmount = usdcAmount;
        finalFiatAmount = usdcAmount * rate.buy;
      } else if (netFiatAmount) {
        // Calculate how much USDC will be received for netFiatAmount of fiat
        finalFiatAmount = netFiatAmount;
        finalUsdcAmount = netFiatAmount / rate.buy;
      } else {
        throw new Error('Either USDC amount or net fiat amount is required');
      }
    }
    
    // Apply mock fees (1% of USDC amount)
    const fee = finalUsdcAmount * 0.01;
    const totalUsdcAmount = direction === 'buy' ? finalUsdcAmount + fee : finalUsdcAmount;
    
    // Generate a unique quote ID
    const quoteId = uuid();
    
    return {
      quoteId,
      usdcRequired: parseFloat(totalUsdcAmount.toFixed(2)),
      fiatAmount: parseFloat(finalFiatAmount.toFixed(2)),
      fiatCurrency: currency,
      fee: parseFloat(fee.toFixed(2)),
      rate: direction === 'buy' ? rate.sell : rate.buy,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes from now
    };
  }
  
  /**
   * Submit payment
   * @param {object} params - Payment parameters
   * @param {string} params.recipientExchangeId - Recipient's exchange ID
   * @param {string} params.recipientAccountId - Recipient's account ID
   * @param {number} params.recipientAmount - Amount to deliver in fiat
   * @param {string} params.recipientCurrency - Currency code to deliver
   * @param {string} params.quoteId - Quote ID (optional)
   * @returns {Promise<object>} Payment response
   */
  async submitPayment(params) {
    const { 
      transactionId = uuid(),
      recipientExchangeId, 
      recipientAccountId, 
      recipientAmount, 
      recipientCurrency,
      quoteId
    } = params;
    
    // Get quote or create a new one
    let quote;
    if (quoteId) {
      // In a real implementation, we would retrieve the stored quote
      quote = await this.getQuote({ 
        netFiatAmount: recipientAmount, 
        currency: recipientCurrency, 
        direction: 'buy' 
      });
    } else {
      quote = await this.getQuote({ 
        netFiatAmount: recipientAmount, 
        currency: recipientCurrency, 
        direction: 'buy' 
      });
    }
    
    // Get exchange rate for the sender's currency (using this exchange's currency)
    const rate = this.rates[this.config.currency] || { buy: 1, sell: 1 };
    
    // Calculate sender amount (in this exchange's currency)
    const senderAmount = quote.usdcRequired * rate.buy;
    
    // Create mock transaction
    const transaction = {
      id: transactionId,
      externalId: `mock-tx-${uuid().substring(0, 8)}`,
      status: 'processing',
      senderAmount: parseFloat(senderAmount.toFixed(2)),
      senderCurrency: this.config.currency,
      recipientAmount,
      recipientCurrency,
      recipientExchangeId,
      recipientAccountId,
      usdcAmount: quote.usdcRequired,
      fee: quote.fee,
      createdAt: new Date().toISOString()
    };
    
    // Store transaction
    this.transactions[transaction.externalId] = transaction;
    
    // Simulate async processing
    this.simulateTransactionProcessing(transaction.externalId);
    
    return {
      externalId: transaction.externalId,
      status: transaction.status,
      senderAmount: transaction.senderAmount,
      senderCurrency: transaction.senderCurrency,
      recipientAmount: transaction.recipientAmount,
      recipientCurrency: transaction.recipientCurrency,
      usdcAmount: transaction.usdcAmount,
      fee: transaction.fee
    };
  }
  
  /**
   * Get transaction status
   * @param {string} transactionId - External transaction ID
   * @returns {Promise<object>} Transaction status
   */
  async getTransactionStatus(transactionId) {
    const transaction = this.transactions[transactionId];
    
    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }
    
    return {
      externalId: transaction.externalId,
      status: transaction.status,
      metadata: transaction
    };
  }
  
  /**
   * Simulate transaction processing
   * @param {string} transactionId - External transaction ID
   */
  simulateTransactionProcessing(transactionId) {
    const transaction = this.transactions[transactionId];
    
    if (!transaction) {
      return;
    }
    
    // Simulate transaction processing with delays
    setTimeout(() => {
      transaction.status = 'pending';
      
      // 80% chance of success, 20% chance of failure
      const willSucceed = Math.random() < 0.8;
      
      setTimeout(() => {
        transaction.status = willSucceed ? 'completed' : 'failed';
        transaction.updatedAt = new Date().toISOString();
        
        if (!willSucceed) {
          transaction.failureReason = 'Simulated failure for testing';
        }
      }, 5000 + Math.random() * 10000); // Random delay between 5-15 seconds
    }, 2000); // Initial 2 second delay
  }
}

module.exports = MockAdapter;