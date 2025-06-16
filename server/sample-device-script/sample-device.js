const mqtt = require('mqtt');
const dotenv = require('dotenv');

dotenv.config();

// MQTT broker URL
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';

// Connect to MQTT broker
console.log(`Connecting to MQTT broker at ${MQTT_BROKER_URL}`);
const client = mqtt.connect(MQTT_BROKER_URL);

// Define sample device IDs
const soilSensorIds = ['soil-sensor-001', 'soil-sensor-002', 'soil-sensor-003'];
const weatherSensorIds = ['weather-station-001', 'weather-station-002'];

// Define farm locations (latitude, longitude)
const farmLocations = [
  { lat: 37.7749, lng: -122.4194 }, // San Francisco
  { lat: 34.0522, lng: -118.2437 }, // Los Angeles
  { lat: 40.7128, lng: -74.0060 }  // New York
];

// Generate random soil data
function generateSoilData() {
  const sensorId = soilSensorIds[Math.floor(Math.random() * soilSensorIds.length)];
  const location = farmLocations[Math.floor(Math.random() * farmLocations.length)];
  
  return {
    type: 'soil',
    sensorId,
    timestamp: new Date().toISOString(),
    soil_moisture: parseFloat((Math.random() * 100).toFixed(2)),
    ph: parseFloat((Math.random() * 14).toFixed(2)),
    nutrient: parseFloat((Math.random() * 100).toFixed(2)),
    soil_temp: parseFloat((15 + Math.random() * 15).toFixed(2)),
    location
  };
}

// Generate random weather data
function generateWeatherData() {
  const sensorId = weatherSensorIds[Math.floor(Math.random() * weatherSensorIds.length)];
  const location = farmLocations[Math.floor(Math.random() * farmLocations.length)];
  
  return {
    type: 'weather',
    sensorId,
    timestamp: new Date().toISOString(),
    temperature: parseFloat((15 + Math.random() * 20).toFixed(2)),
    humidity: parseFloat((40 + Math.random() * 60).toFixed(2)),
    rainfall: parseFloat((Math.random() * 10).toFixed(2)),
    wind_speed: parseFloat((Math.random() * 30).toFixed(2)),
    wind_direction: parseFloat((Math.random() * 360).toFixed(2)),
    location
  };
}

// Handle MQTT connection
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  
  // Send data every 5 seconds
  setInterval(() => {
    // 50% chance to send soil data, 50% chance to send weather data
    const isSoilData = Math.random() > 0.5;
    
    // Generate and send data
    if (isSoilData) {
      const data = generateSoilData();
      const topic = `device/soil/${data.sensorId}`;
      
      console.log(`Sending soil data to topic: ${topic}`);
      console.log(data);
      
      client.publish(topic, JSON.stringify(data));
    } else {
      const data = generateWeatherData();
      const topic = `device/weather/${data.sensorId}`;
      
      console.log(`Sending weather data to topic: ${topic}`);
      console.log(data);
      
      client.publish(topic, JSON.stringify(data));
    }
  }, 5000);
});

// Handle errors
client.on('error', (err) => {
  console.error('MQTT error:', err);
});

console.log('Device simulation started. Press Ctrl+C to stop.'); 