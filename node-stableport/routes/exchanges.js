const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchanges');

router.get('/', exchangeController.getExchangePartners);
router.get('/linked', exchangeController.getLinkedExchanges);

module.exports = router;