const fetch = require('node-fetch');
const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config({path: './config/.env'});

const databaseUrl = "https://embedded-sys2-default-rtdb.asia-southeast1.firebasedatabase.app/.json";
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

    // Helper function to find the most recent entry with a timestamp
    const getMostRecentEntryWithTimestamp = (data) => {
      const keys = Object.keys(data);
      if (keys.length === 0) return null;
      
      const mostRecentKey = keys.at(-1); // Get the last key (most recent)
      return {
        timestamp: mostRecentKey,
        value: data[mostRecentKey],
      };
    };

    const mostRecentLdrEntry = getMostRecentEntryWithTimestamp(ldrData);
    const mostRecentMotionEntry = getMostRecentEntryWithTimestamp(motionData);
    const mostRecentSoilEntry = getMostRecentEntryWithTimestamp(soilData);
    const mostRecentTempEntry = getMostRecentEntryWithTimestamp(tempData);

    console.log("Most recent soil entry:", mostRecentSoilEntry);

    return {
      brightness: mostRecentLdrEntry,
      motion: mostRecentMotionEntry,
      soil: mostRecentSoilEntry,
      temperature: mostRecentTempEntry,
    };
  } catch (error) {
    console.error("Failed to fetch recent plant data:", error);
    return null;
  }
};