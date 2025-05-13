const { verifyOAuthToken } = require('../utils/oauth');

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    // @MEMO: temporary skip
    // if (!token) {
    //   return res.status(401).json({ error: { message: 'Authentication required', code: 'AUTH_REQUIRED' } });
    // }
    
    // // Verify user from session or token
    // const user = req.session.user || await verifyOAuthToken(token);
    
    // if (!user) {
    //   return res.status(401).json({ error: { message: 'Invalid token', code: 'INVALID_TOKEN' } });
    // }

    const user = {
      id: '',
      email: '',
      linkedExchanges: []
    }
    
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};