const amqp = require('amqplib');
const dotenv = require('dotenv');

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env.development';
console.log(`Loading environment from ${envFile}`);
dotenv.config({ path: envFile });

// RabbitMQ variables
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:password@rabbitmq:5672';
console.log(`Using RabbitMQ URL: ${RABBITMQ_URL}`);
const INPUT_EXCHANGE = 'agrify.events';
const OUTPUT_EXCHANGE = 'agrify.data';
const INPUT_QUEUE = 'raw-data-queue';
const INPUT_ROUTING_KEY = 'device.data.raw';

// Parser function to determine the data type and parse it
function parseData(rawData) {
  try {
    const data = JSON.parse(rawData);
    console.log('Raw data received:', data);
    
    // Check if it has a type field
    if (data.type) {
      // For soil data
      if (data.type === 'soil') {
        return {
          type: 'soil',
          parsed: true,
          sensorId: data.sensorId || 'unknown',
          timestamp: data.timestamp || new Date().toISOString(),
          value: {
            moisture: data.soil_moisture || null,
            ph: data.ph || null,
            nutrient: data.nutrient || null,
            temperature: data.soil_temp || null
          },
          location: data.location || { lat: 0, lng: 0 }
        };
      }
      
      // For weather data
      if (data.type === 'weather') {
        return {
          type: 'weather',
          parsed: true,
          sensorId: data.sensorId || 'unknown',
          timestamp: data.timestamp || new Date().toISOString(),
          value: {
            temperature: data.temperature || null,
            humidity: data.humidity || null,
            rainfall: data.rainfall || null,
            windSpeed: data.wind_speed || null,
            windDirection: data.wind_direction || null
          },
          location: data.location || { lat: 0, lng: 0 }
        };
      }
      
      // For other types
      return {
        type: data.type,
        parsed: true,
        sensorId: data.sensorId || 'unknown',
        timestamp: data.timestamp || new Date().toISOString(),
        value: data.value || {},
        location: data.location || { lat: 0, lng: 0 }
      };
    }
    
    // Try to determine the type based on the fields
    if (data.soil_moisture || data.soilMoisture || data.ph) {
      return {
        type: 'soil',
        parsed: true,
        sensorId: data.sensorId || 'unknown',
        timestamp: data.timestamp || new Date().toISOString(),
        value: {
          moisture: data.soil_moisture || data.soilMoisture || null,
          ph: data.ph || null,
          nutrient: data.nutrient || data.nutrients || null,
          temperature: data.soil_temp || data.soilTemp || data.temperature || null
        },
        location: data.location || { lat: 0, lng: 0 }
      };
    }
    
    if (data.temperature || data.humidity || data.rainfall) {
      return {
        type: 'weather',
        parsed: true,
        sensorId: data.sensorId || 'unknown',
        timestamp: data.timestamp || new Date().toISOString(),
        value: {
          temperature: data.temperature || null,
          humidity: data.humidity || null,
          rainfall: data.rainfall || null,
          windSpeed: data.windSpeed || data.wind_speed || null,
          windDirection: data.windDirection || data.wind_direction || null
        },
        location: data.location || { lat: 0, lng: 0 }
      };
    }
    
    // Default case - unknown type
    return {
      type: 'unknown',
      parsed: true,
      sensorId: data.sensorId || 'unknown',
      timestamp: data.timestamp || new Date().toISOString(),
      value: data.value || data || {},
      location: data.location || { lat: 0, lng: 0 }
    };
  } catch (error) {
    console.error('Error parsing data:', error);
    return {
      type: 'error',
      parsed: false,
      error: error.message,
      raw: rawData
    };
  }
}

// Connect to RabbitMQ and process messages
async function start() {
  try {
    // Connect to RabbitMQ
    console.log(`Connecting to RabbitMQ at ${RABBITMQ_URL}...`);
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    // Setup exchanges
    await channel.assertExchange(INPUT_EXCHANGE, 'topic', { durable: true });
    await channel.assertExchange(OUTPUT_EXCHANGE, 'topic', { durable: true });
    
    // Setup queue
    const { queue } = await channel.assertQueue(INPUT_QUEUE, { durable: true });
    await channel.bindQueue(queue, INPUT_EXCHANGE, INPUT_ROUTING_KEY);
    
    console.log('Connected to RabbitMQ, waiting for messages...');
    
    // Consume messages
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        try {
          const content = msg.content.toString();
          console.log('Received raw data:', content);
          
          // Parse the data
          const parsedData = parseData(content);
          console.log('Parsed data:', JSON.stringify(parsedData));
          
          // Route based on data type
          if (parsedData.type === 'soil') {
            console.log('Publishing soil data to queue');
            channel.publish( 
              OUTPUT_EXCHANGE,
              'data.soil',
              Buffer.from(JSON.stringify(parsedData)),
              { persistent: true }
            );
          } else if (parsedData.type === 'weather') {
            console.log('Publishing weather data to queue');
            channel.publish(
              OUTPUT_EXCHANGE,
              'data.weather',
              Buffer.from(JSON.stringify(parsedData)),
              { persistent: true }
            );
          } else {
            // Unknown type, forward to a general queue
            console.log('Publishing unknown data to queue');
            channel.publish(
              OUTPUT_EXCHANGE,
              'data.unknown',
              Buffer.from(JSON.stringify(parsedData)),
              { persistent: true }
            );
          }
          
          // Acknowledge message
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          // Negative acknowledge and requeue
          channel.nack(msg, false, true);
        }
      }
    });
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    setTimeout(start, 5000);
  }
}

// Start the service
start(); 