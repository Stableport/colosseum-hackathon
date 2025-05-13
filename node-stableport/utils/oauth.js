const axios = require('axios');
const querystring = require('querystring');
const exchangeModel = require('../models/exchange');

/**
 * Generate OAuth URL for the specified exchange partner
 * @param {string} exchangeId - ID of the exchange partner
 * @returns {string} OAuth authorization URL
 */
exports.generateOAuthUrl = (exchangeId) => {
  const exchangePartners = exchangeModel.getAll();
  const exchange = exchangePartners.find(ex => ex.id === exchangeId);
  
  if (!exchange) {
    throw new Error(`Exchange partner ${exchangeId} not found`);
  }
  
  const redirectUri = process.env.OAUTH_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';
  
  const params = {
    client_id: exchange.oauth.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'read write transactions',
    state: exchangeId, // Store exchange ID in state for validation
  };
  
  return `${exchange.oauth.authUrl}?${querystring.stringify(params)}`;
};

/**
 * Exchange authorization code for access token
 * @param {string} exchangeId - ID of the exchange partner
 * @param {string} code - Authorization code from OAuth callback
 * @returns {Promise<object>} Token response
 */
exports.exchangeCodeForToken = async (exchangeId, code) => {
  const exchangePartners = exchangeModel.getAll();
  const exchange = exchangePartners.find(ex => ex.id === exchangeId);
  
  if (!exchange) {
    throw new Error(`Exchange partner ${exchangeId} not found`);
  }
  
  const redirectUri = process.env.OAUTH_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';
  
  try {
    // If we're in development mode, simulate the token response
    if (process.env.NODE_ENV !== 'production') {
      return simulateTokenResponse(exchangeId, code);
    }
    
    // Real OAuth token exchange
    const response = await axios.post(exchange.oauth.tokenUrl, {
      grant_type: 'authorization_code',
      client_id: exchange.oauth.clientId,
      client_secret: process.env[`${exchangeId.toUpperCase()}_CLIENT_SECRET`] || 'mock_client_secret',
      code,
      redirect_uri: redirectUri,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw new Error(`Failed to exchange code for token: ${error.message}`);
  }
};

/**
 * Verify OAuth token with exchange partner
 * @param {string} token - OAuth access token
 * @returns {Promise<object|null>} User info or null if invalid
 */
exports.verifyOAuthToken = async (token) => {
  try {
    // Extract exchange ID from token (in real implementation, this would be done differently)
    const [exchangeId, tokenValue] = token.split(':');
    
    //@TBD
  } catch (e) {

  }
}