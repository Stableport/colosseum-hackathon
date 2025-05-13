const YellowcardAdapter = require('./providers/yellowcard');
const MockAdapter = require('./providers/mock');

/**
 * Exchange Adapter Factory
 * 
 * This factory creates and returns the appropriate exchange adapter based on the exchange ID.
 * It abstracts away the specific implementation details of each exchange partner API.
 */
class ExchangeAdapterFactory {
  constructor() {
    this.adapters = {};
    this.registerDefaultAdapters();
  }
  
  /**
   * Register built-in adapters
   */
  registerDefaultAdapters() {
    // Register Yellowcard adapter for production exchange
    this.registerAdapter('yellowcard', () => new YellowcardAdapter());
    
    // Register mock adapters for development/testing
    this.registerAdapter('exchange_a', () => new MockAdapter({
      exchangeId: 'exchange_a',
      name: 'Exchange A',
      country: 'UG',
      currency: 'UGX'
    }));
  }
  
  /**
   * Register a new adapter
   * @param {string} exchangeId - ID of the exchange
   * @param {Function} factory - Factory function to create the adapter
   */
  registerAdapter(exchangeId, factory) {
    this.adapters[exchangeId] = factory;
  }
  
  /**
   * Get adapter for specified exchange
   * @param {string} exchangeId - ID of the exchange
   * @returns {object} Exchange adapter instance
   */
  getAdapter(exchangeId) {
    const factory = this.adapters[exchangeId];
    
    if (!factory) {
      throw new Error(`No adapter registered for exchange ${exchangeId}`);
    }
    
    return factory();
  }
}

// Create singleton instance
const adapterFactory = new ExchangeAdapterFactory();

/**
 * Get quote from exchange
 * @param {string} exchangeId - ID of the exchange
 * @param {object} params - Quote parameters
 * @param {string} token - OAuth token for user authorization
 * @returns {Promise<object>} Quote information
 */
exports.getQuote = async (exchangeId, params, token = null) => {
  try {
    const adapter = adapterFactory.getAdapter(exchangeId);
    return await adapter.getQuote(params, token);
  } catch (error) {
    console.error(`Error getting quote from ${exchangeId}:`, error);
    throw error;
  }
};

/**
 * Initiate transaction with exchange
 * @param {string} exchangeId - ID of the exchange
 * @param {object} params - Transaction parameters
 * @param {string} token - OAuth token for user authorization
 * @returns {Promise<object>} Transaction information
 */
exports.initiateTransaction = async (exchangeId, params, token = null) => {
  try {
    const adapter = adapterFactory.getAdapter(exchangeId);
    return await adapter.submitPayment(params, token);
  } catch (error) {
    console.error(`Error initiating transaction with ${exchangeId}:`, error);
    throw error;
  }
};

/**
 * Get transaction status from exchange
 * @param {string} exchangeId - ID of the exchange
 * @param {string} transactionId - External transaction ID
 * @param {string} token - OAuth token for user authorization
 * @returns {Promise<object>} Transaction status
 */
exports.getTransactionStatus = async (exchangeId, transactionId, token = null) => {
  try {
    const adapter = adapterFactory.getAdapter(exchangeId);
    return await adapter.getTransactionStatus(transactionId, token);
  } catch (error) {
    console.error(`Error getting transaction status from ${exchangeId}:`, error);
    throw error;
  }
};

/**
 * Register new exchange adapter
 * @param {string} exchangeId - ID of the exchange
 * @param {Function} factory - Factory function to create the adapter
 */
exports.registerAdapter = (exchangeId, factory) => {
  adapterFactory.registerAdapter(exchangeId, factory);
};

/**
 * Get supported exchanges
 * @returns {Array<string>} List of supported exchange IDs
 */
exports.getSupportedExchanges = () => {
  return Object.keys(adapterFactory.adapters);
};