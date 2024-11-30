const { v4: uuidv4 } = require('uuid');
const { getRecentPlantData } = require('./plantService');

let notifications = []; // Replace with a database in production

const evaluateNotifications = (plant) => {
    const newNotifications = [];
    const plantTimestamp = new Date(parseInt(plant.time, 10) * 1000).toISOString();
  
    const notificationTypes = {
      "moistureHigh": plant.moisture > 80,
      "moistureLow": plant.moisture < 20,
      "temperatureHigh": plant.temperature > 30,
      "brightnessLow": plant.brightness < 20,
      "motionDetected": plant.motion === "detected",
    };
  
    Object.keys(notificationTypes).forEach((type) => {
      if (notificationTypes[type]) {
        const notification = {
          id: uuidv4(), // Unique ID
          title: type.replace(/([A-Z])/g, ' $1').trim(), // Convert camelCase to human-readable title
          message: generateNotificationMessage(type, plant),
          timestamp: plantTimestamp,
          type: type,
        };
  
        newNotifications.push(notification);
      }
    });
  
    return newNotifications;
  };
  
  const generateNotificationMessage = (type, plant) => {
    switch (type) {
      case "moistureHigh":
        return `Soil moisture is ${plant.moisture}% (exceeds safe level).`;
      case "moistureLow":
        return `Soil moisture is ${plant.moisture}% (too low).`;
      case "temperatureHigh":
        return `Temperature is ${plant.temperature}°C (too hot).`;
      case "brightnessLow":
        return `Brightness is ${plant.brightness} (too dark for healthy growth).`;
      case "motionDetected":
        return "Movement detected near Plant #1";
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