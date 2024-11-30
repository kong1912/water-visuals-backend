// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Define route for fetching notifications
router.get('/notifications', notificationController.getNotifications);

module.exports = router;
