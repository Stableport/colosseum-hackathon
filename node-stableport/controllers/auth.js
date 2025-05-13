const { generateOAuthUrl, exchangeCodeForToken } = require('../utils/oauth');
const userModel = require('../models/user');

exports.initiateLogin = (req, res) => {
  const { exchangeId } = req.params;
  
  try {
    // Generate OAuth URL for the selected exchange partner
    const authUrl = generateOAuthUrl(exchangeId);
    
    // Store exchange ID in session for callback verification
    req.session.exchangeId = exchangeId;
    
    res.redirect(authUrl);
  } catch (error) {
    console.error('OAuth initiation error:', error);
    res.status(500).json({ error: { message: 'Authentication initiation failed', code: 'AUTH_INIT_FAILED' } });
  }
};

exports.handleCallback = async (req, res) => {
  const { code } = req.query;
  const exchangeId = req.session.exchangeId;
  
  if (!code || !exchangeId) {
    return res.status(400).json({ error: { message: 'Invalid callback parameters', code: 'INVALID_CALLBACK' } });
  }
  
  try {
    // Exchange code for access token
    const tokenData = await exchangeCodeForToken(exchangeId, code);
    
    // Get or create user
    let user = await userModel.findByExchangeId(exchangeId, tokenData.user_id);
    
    if (!user) {
      // Create new user
      user = await userModel.create({
        email: tokenData.email,
        linkedExchanges: [{
          exchangeId,
          oauthToken: tokenData.access_token,
          userId: tokenData.user_id
        }]
      });
    } else {
      // Update or add OAuth token to existing user
      user = await userModel.linkExchange(user.id, {
        exchangeId,
        oauthToken: tokenData.access_token,
        userId: tokenData.user_id
      });
    }
    
    // Store user in session
    req.session.user = {
      id: user.id,
      email: user.email
    };
    
    // Redirect to frontend dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: { message: 'Authentication failed', code: 'AUTH_FAILED' } });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: 'Logged out successfully' });
};

exports.getAuthStatus = (req, res) => {
  if (req.session.user) {
    res.status(200).json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.status(200).json({ isAuthenticated: false });
  }
};