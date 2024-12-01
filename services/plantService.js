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

    // Get the most recent entry by accessing the last key in each object
    const mostRecentLdrEntry = ldrData?.[Object.keys(ldrData).at(-1)] || null;
    const mostRecentMotionEntry = motionData?.[Object.keys(motionData).at(-1)] || null;
    const mostRecentSoilEntry = soilData?.[Object.keys(soilData).at(-1)] || null;
    const mostRecentTempEntry = tempData?.[Object.keys(tempData).at(-1)] || null;

    console.log(mostRecentSoilEntry);

    return {
      brightness: mostRecentLdrEntry?.ldr_value,
      motion: mostRecentMotionEntry?.motion,
      moisture: mostRecentSoilEntry?.soil_moisture,
      temperature: mostRecentTempEntry?.temperature,
      humidity: mostRecentTempEntry?.humidity,
    };
  } catch (error) {
    console.error("Failed to fetch recent plant data:", error);
    return null;
  }
};

exports.identifyPlant = async (imageURL) => {
  try {
      // Fetch the image from the provided URL
      const response = await axios.get(imageURL, { responseType: 'arraybuffer' });
      const imgBuffer = Buffer.from(response.data, 'binary');

      // Encode the fetched image to base64
      const encodedImage = imgBuffer.toString('base64');

      // Define the data payload
      const data = {
          images: [`data:image/jpg;base64,${encodedImage}`],  // Base64 encoded image
          similar_images: true  // Optional, whether to find similar images
      };

      const headers = {
          'Api-Key': process.env.API_KEY  // Replace with your actual PlantNet API key
      };

      // Send the POST request to PlantNet API
      const plantNetResponse = await axios.post('https://plant.id/api/v3/identification', data, { headers });

      return plantNetResponse;
  } catch (error) {
      console.error('Error in identifyPlant service:', error);
      throw new Error('An error occurred while identifying the plant.');
  }
};
