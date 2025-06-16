const aedes = require('aedes')();
const { createServer } = require('net');
const ws = require('websocket-stream');
const http = require('http');
const amqp = require('amqplib');
const dotenv = require('dotenv');

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';
console.log(`Loading environment from ${envFile}`);
dotenv.config({ path: envFile });

// MQTT TCP Server
const server = createServer(aedes.handle);
const port = process.env.MQTT_PORT || 1883;

// MQTT WebSocket Server
const httpServer = http.createServer();
const wsPort = process.env.WS_PORT || 8888;
ws.createServer({ server: httpServer }, aedes.handle);

// RabbitMQ variables
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:password@rabbitmq:5672';
console.log(`Using RabbitMQ URL: ${RABBITMQ_URL}`);
const EXCHANGE_NAME = 'agrify.events';
const ROUTING_KEY_PREFIX = 'device.data.';
let channel;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 10;

// Connect to RabbitMQ
async function connectToRabbitMQ() {
  try {
    connectionAttempts++;
    console.log(`Attempting to connect to RabbitMQ (attempt ${connectionAttempts}/${MAX_CONNECTION_ATTEMPTS})...`);
    
    const connection = await amqp.connect(RABBITMQ_URL);
    
    // Reset connection attempts on successful connection
    connectionAttempts = 0;
    
    // Setup connection error handler
    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
      setTimeout(connectToRabbitMQ, 5000);
    });
    
    channel = await connection.createChannel();
    
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    
    // Setup queue for raw data
    const queueName = 'raw-data-queue';
    await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(queueName, EXCHANGE_NAME, ROUTING_KEY_PREFIX + 'raw');
    
    console.log('Successfully connected to RabbitMQ');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    
    if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
      const delay = Math.min(5000 * connectionAttempts, 30000);
      console.log(`Retrying in ${delay/1000} seconds...`);
      setTimeout(connectToRabbitMQ, delay);
    } else {
      console.error(`Failed to connect to RabbitMQ after ${MAX_CONNECTION_ATTEMPTS} attempts. Running in degraded mode.`);
      console.error('Messages will not be forwarded to RabbitMQ.');
    }
  }
}

// Handle MQTT client connections
aedes.on('client', client => {
  console.log(`Client connected: ${client.id}`);
});

// Handle MQTT client disconnections
aedes.on('clientDisconnect', client => {
  console.log(`Client disconnected: ${client.id}`);
});

// Handle MQTT publish events
aedes.on('publish', async (packet, client) => {
  if (!client) return; // Ignore packets from the broker itself
  
  console.log(`Message received on topic: ${packet.topic}`);
  
  try {
    // Only forward messages from devices (not internal messages)
    if (packet.topic.startsWith('device/')) {
      const message = packet.payload.toString();
      console.log(`Received message: ${message}`);
      
      // Determine the routing key based on the topic
      const topicParts = packet.topic.split('/');
      let routingKey = ROUTING_KEY_PREFIX + 'raw';
      
      // Forward to RabbitMQ if connected
      if (channel) {
        console.log(`Forwarding message to RabbitMQ with routing key: ${routingKey}`);
        channel.publish(
          EXCHANGE_NAME,
          routingKey,
          Buffer.from(message),
          { persistent: true }
        );
      } else {
        console.warn('Not connected to RabbitMQ, message will not be forwarded');
      }
    }
  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
});

// Start the servers
server.listen(port, function () {
  console.log(`MQTT broker listening on port ${port}`);
});

httpServer.listen(wsPort, function () {
  console.log(`WebSocket server listening on port ${wsPort}`);
});

// Connect to RabbitMQ on startup
connectToRabbitMQ(); 