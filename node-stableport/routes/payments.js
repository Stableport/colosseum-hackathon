const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payments');

router.post('/quote', paymentController.getQuote);
router.post('/initiate', paymentController.initiatePayment);
router.get('/status/:transactionId', paymentController.getTransactionStatus);
router.get('/history', paymentController.getTransactionHistory);
router.get('/export', paymentController.exportTransactions);

module.exports = router;