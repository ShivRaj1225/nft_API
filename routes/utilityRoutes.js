const express = require('express');
const router = express.Router();
const utilityController = require('../controllers/utilityController');

router.post('/convert-eth-to-usd', utilityController.convertEthToUsd);

module.exports = router;
