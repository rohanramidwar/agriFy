const express = require("express");
const mongoose = require("mongoose");
const amqp = require("amqplib");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables based on NODE_ENV
const envFile =
  process.env.NODE_ENV === "development" ? ".env.development" : ".env";
console.log(`Loading environment from ${envFile}`);
dotenv.config({ path: envFile });

// Express app setup
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB setup
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://admin:password@mongodb:27027/agrify?authSource=admin";
console.log(`Using MongoDB URI: ${MONGO_URI}`);
const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://admin:password@rabbitmq:5672";
console.log(`Using RabbitMQ URL: ${RABBITMQ_URL}`);
const PORT = process.env.PORT || 3001;

// Define Soil Data schema
const soilDataSchema = new mongoose.Schema(
  {
    sensorId: String,
    timestamp: { type: Date, default: Date.now },
    value: {
      moisture: Number,
      ph: Number,
      nutrient: Number,
      temperature: Number,
    },
    location: {
      lat: Number,
      lng: Number,
    },
  },
  { timestamps: true }
);

const SoilData = mongoose.model("SoilData", soilDataSchema);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// RabbitMQ setup
const EXCHANGE_NAME = "agrify.data";
const SOIL_QUEUE = "soil-data-queue";
const ROUTING_KEY = "data.soil";

// API Routes
app.get("/", (req, res) => {
  res.send("Soil Data Microservice is running");
});

// Get all soil data
app.get("/api/soil-data", async (req, res) => {
  try {
    const { limit = 100, offset = 0, sensorId } = req.query;

    const query = sensorId ? { sensorId } : {};

    const soilData = await SoilData.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .skip(Number(offset));

    res.json(soilData);
  } catch (error) {
    console.error("Error fetching soil data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get soil data by ID
app.get("/api/soil-data/:id", async (req, res) => {
  try {
    const soilData = await SoilData.findById(req.params.id);

    if (!soilData) {
      return res.status(404).json({ error: "Soil data not found" });
    }

    res.json(soilData);
  } catch (error) {
    console.error("Error fetching soil data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Connect to RabbitMQ and process messages
async function connectToRabbitMQ() {
  try {
    // Connect to RabbitMQ
    console.log(`Connecting to RabbitMQ at ${RABBITMQ_URL}...`);
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Setup exchange
    await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: true });

    // Setup queue
    const { queue } = await channel.assertQueue(SOIL_QUEUE, { durable: true });
    await channel.bindQueue(queue, EXCHANGE_NAME, ROUTING_KEY);

    console.log("Connected to RabbitMQ, waiting for soil data messages...");

    // Consume messages
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const content = msg.content.toString();
          console.log("Received soil data:", content);

          const data = JSON.parse(content);
          console.log("Parsed soil data:", data);

          // Create new soil data document
          const soilData = new SoilData({
            sensorId: data.sensorId,
            timestamp: data.timestamp,
            value: data.value || {}, // Ensure value is included
            location: data.location,
          });

          // Log the data being saved
          console.log(
            "Saving soil data with values:",
            JSON.stringify(soilData)
          );

          // Save to database
          const savedData = await soilData.save();
          console.log("Soil data saved to database:", savedData);

          // Acknowledge message
          channel.ack(msg);
        } catch (error) {
          console.error("Error processing soil data message:", error);
          // Negative acknowledge and requeue
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    setTimeout(connectToRabbitMQ, 5000);
  }
}

// Start Express server
app.listen(PORT, () => {
  console.log(`Soil Data Microservice running on port ${PORT}`);
});

// Connect to RabbitMQ
connectToRabbitMQ();
