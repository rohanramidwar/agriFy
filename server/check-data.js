const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://admin:password@localhost:27027/agrify?authSource=admin';
const client = new MongoClient(url);

async function main() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB');

    // Get the database
    const db = client.db('agrify');

    // Check soil data collection
    const soilDataCollection = db.collection('soildatas');
    const soilDataCount = await soilDataCollection.countDocuments();
    console.log(`Soil data collection has ${soilDataCount} documents`);

    if (soilDataCount > 0) {
      const soilData = await soilDataCollection.find().sort({ timestamp: -1 }).limit(3).toArray();
      console.log('Latest soil data:');
      console.log(JSON.stringify(soilData, null, 2));
    }

    // Check weather data collection
    const weatherDataCollection = db.collection('weatherdatas');
    const weatherDataCount = await weatherDataCollection.countDocuments();
    console.log(`Weather data collection has ${weatherDataCount} documents`);

    if (weatherDataCount > 0) {
      const weatherData = await weatherDataCollection.find().sort({ timestamp: -1 }).limit(3).toArray();
      console.log('Latest weather data:');
      console.log(JSON.stringify(weatherData, null, 2));
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

main().catch(console.error); 