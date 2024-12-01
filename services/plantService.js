const fetch = require('node-fetch');

const databaseUrl = "https://embedded-sys2-default-rtdb.asia-southeast1.firebasedatabase.app/.json"
exports.getAllPlantData = async () => {
  try {
    const response = await fetch(databaseUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Extract only the required data
    const ldrData = data?.ldr || {};
    const motionData = data?.motion || {};
    const soilData = data?.soil || {};
    const tempData = data?.temp || {};

    return {
      ldrData,
      motionData,
      soilData,
      tempData,
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return {
      ldrData: {},
      motionData: {},
      soilData: {},
      tempData: {},
    };
  }
};

exports.getRecentPlantData = async () => {
  try {
    const { ldrData, motionData, soilData, tempData } = await this.getAllPlantData();
    if (!ldrData || !motionData || !soilData || !tempData) {
      return null;
    }

    // Get the most recent entry by accessing the last key in each object
    const mostRecentLdrEntry = ldrData?.[Object.keys(ldrData).at(-1)] || null;
    const mostRecentMotionEntry = motionData?.[Object.keys(motionData).at(-1)] || null;
    const mostRecentSoilEntry = soilData?.[Object.keys(soilData).at(-1)] || null;
    const mostRecentTempEntry = tempData?.[Object.keys(tempData).at(-1)] || null;

    return {
      time: Object.keys(tempData).at(-1), // Use the last timestamp as the most recent
      brightness: mostRecentLdrEntry?.ldr_value || null,
      motion: mostRecentMotionEntry?.motion || null,
      moisture: mostRecentSoilEntry?.soil_moisture || null,
      temperature: mostRecentTempEntry?.temperature || null,
      humidity: mostRecentTempEntry?.humidity || null,
    };
  } catch (error) {
    console.error("Failed to fetch recent plant data:", error);
    return null;
  }
};
