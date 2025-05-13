const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile');

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
// router.post('/link/:exchangeId', profileController.linkExchange);
// router.delete('/link/:exchangeId', profileController.unlinkExchange);

module.exports = router;