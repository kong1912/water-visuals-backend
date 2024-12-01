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

exports.identifyPlant = async (req, res) => {
  try {
      const reqURL = 'https://media.discordapp.net/attachments/1171302901948371024/1312713856681775154/20241201_163547.jpg?ex=674d7f8c&is=674c2e0c&hm=7eae4063c937cf84209769b76aed0a93e5d30746cb1637c3cb69765e03946a5e&=&format=webp&width=496&height=662';
      const plantNetResponse = await identifyPlant(reqURL);

      if (plantNetResponse.status === 201) {
          res.json(plantNetResponse.data);
      } else {
          res.status(plantNetResponse.status).send(plantNetResponse.statusText);
      }
  } catch (error) {
      console.error('Error in identifyPlantController:', error);
      res.status(500).send('An error occurred');
  }
};