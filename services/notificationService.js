const { v4: uuidv4 } = require('uuid');
const { getRecentPlantData } = require('./plantService');

const evaluateNotifications = (plant) => {
  const newNotifications = [];

  // Notification types and their conditions
  const notificationTypes = {
    moistureLow: plant.soil.value.soil_moisture > 50,
    moistureNormal: plant.soil.value.soil_moisture <= 50,
    motionDetected: plant.motion.value.motion === "detected",
  };

  // Iterate over notification types and create notifications with their timestamps
  Object.keys(notificationTypes).forEach((type) => {
    if (notificationTypes[type]) {
      let timestamp;
      switch (type) {
        case "moistureLow":
          timestamp = new Date(parseInt(plant.soil.timestamp, 10) * 1000);
          break;
        case "moistureNormal":
          timestamp = new Date(parseInt(plant.soil.timestamp, 10) * 1000);
          break;
        case "motionDetected":
          timestamp = new Date(parseInt(plant.motion.timestamp, 10) * 1000);
          break;
      }

      const formattedTimestamp = `${timestamp.getDate().toString().padStart(2, '0')}/${(timestamp.getMonth() + 1).toString().padStart(2, '0')}/${timestamp.getFullYear()} ${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}:${timestamp.getSeconds().toString().padStart(2, '0')}`;

      const notification = {
        id: uuidv4(), // Unique ID
        title: type.replace(/([A-Z])/g, ' $1').trim(), // Convert camelCase to human-readable title
        message: generateNotificationMessage(type, plant),
        timestamp: formattedTimestamp, // Include detailed timestamp
        type: type,
      };

      newNotifications.push(notification);
    }
  });

  return newNotifications;
};

// Function to generate the notification message based on type and plant data
const generateNotificationMessage = (type, plant) => {
  switch (type) {
    case "moistureLow":
      return `Soil moisture is too low.`;
    case "motionDetected":
      return "Motion detected";
    default:
      return "";
  }
};

// Function to get recent data and evaluate notifications
const getPlantNotification = async () => {
  try {
    const plant = await getRecentPlantData();
    if (plant) {
      return evaluateNotifications(plant);
    } else {
      console.log("No plant data found.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching plant data:", error);
    return [];
  }
};

module.exports = {
  getPlantNotification,
};
