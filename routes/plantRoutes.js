const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');

router.get('/all', plantController.getAllPlantData);
router.get('/recent', plantController.getRecentPlantData);

module.exports = router;
