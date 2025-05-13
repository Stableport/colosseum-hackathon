const userModel = require('../models/user');

exports.getProfile = async (req, res, next) => {
    try {
      const user = await userModel.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ error: { message: 'User not found', code: 'USER_NOT_FOUND' } });
      }
      
      // Don't send sensitive data like OAuth tokens
      res.status(200).json({
        id: user.id,
        email: user.email,
        linkedExchanges: user.linkedExchanges.map(ex => ({
          exchangeId: ex.exchangeId,
          exchangeName: ex.exchangeName || ex.exchangeId,
          linkedAt: ex.linkedAt
        }))
      });
    } catch (error) {
      next(error);
    }
  };
  
  exports.updateProfile = async (req, res, next) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: { message: 'Email is required', code: 'MISSING_EMAIL' } });
      }
      
      const updatedUser = await userModel.update(req.user.id, { email });
      
      res.status(200).json({
        id: updatedUser.id,
        email: updatedUser.email
      });
    } catch (error) {
      next(error);
    }
  };
  
  exports.linkExchange = async (req, res, next) => {
    // This is handled by the OAuth flow
    res.status(501).json({ error: { message: 'Use OAuth flow to link exchanges', code: 'USE_OAUTH' } });
  };
  
  exports.unlinkExchange = async (req, res, next) => {
    try {
      const { exchangeId } = req.params;
      
      if (!exchangeId) {
        return res.status(400).json({ error: { message: 'Exchange ID is required', code: 'MISSING_EXCHANGE_ID' } });
      }
      
      const user = await userModel.findById(req.user.id);
      
      // Check if exchange is linked
      const exchangeIndex = user.linkedExchanges.findIndex(ex => ex.exchangeId === exchangeId);
      
      if (exchangeIndex === -1) {
        return res.status(404).json({ error: { message: 'Exchange not linked', code: 'EXCHANGE_NOT_LINKED' } });
      }
      
      // Check if this is the last linked exchange
      if (user.linkedExchanges.length === 1) {
        return res.status(400).json({ 
          error: { 
            message: 'Cannot unlink last exchange partner', 
            code: 'LAST_EXCHANGE' 
          } 
        });
      }
      
      await userModel.unlinkExchange(req.user.id, exchangeId);
      
      res.status(200).json({ message: 'Exchange unlinked successfully' });
    } catch (error) {
      next(error);
    }
  };