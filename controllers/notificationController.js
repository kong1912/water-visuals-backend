// controllers/notificationController.js
const { getPlantNotification } = require('../services/notificationService');

const getNotifications = async (req, res) => {
  try {
    // Fetch notifications from the service
    const notifications = await getPlantNotification();
    if (notifications.length > 0) {
      res.status(200).json({ success: true, notifications });
    } else {
      res.status(200).json({ success: true, message: 'No new notifications at this time.' });
    }
  } catch (error) {
    console.error('Error in getNotifications controller:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
  }
};

module.exports = {
  getNotifications,
};
