const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// OAuth 2.0 routes
// @TBD
router.get('/login/:exchangeId', authController.initiateLogin);
router.get('/callback', authController.handleCallback);
router.post('/logout', authController.logout);
router.get('/status', authController.getAuthStatus);

module.exports = router;