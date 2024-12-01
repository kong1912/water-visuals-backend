const plantService = require('../services/plantService');
databaseURL = process.env.DATABASE_URL

exports.getAllPlantData = async (req, res) => {
  try {
    const data = await plantService.getAllPlantData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecentPlantData = async (req, res) => {
  try {
    const data = await plantService.getRecentPlantData();
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "No recent plant data found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
