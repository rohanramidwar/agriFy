# AgriFy - IoT-based Agriculture Platform

An IoT-based agriculture platform that collects data from devices, processes it, and stores it in appropriate databases.

## Architecture

The platform uses a microservice architecture with the following components:

1. **MQTT Broker (Aedes Service)** - Handles MQTT communication with IoT devices
2. **Parser Service** - Processes raw data from IoT devices
3. **Soil Data Microservice** - Handles soil-related data storage and processing
4. **Weather Data Microservice** - Handles weather-related data storage and processing

## Technologies Used

- MQTT (Aedes) for IoT device communication
- RabbitMQ for inter-service message queuing
- MongoDB for data storage
- Node.js with Express for microservice implementation
- Docker and Docker Compose for containerization

## Project Structure

```
agriFy/
├── aedes-service/           # MQTT broker service
├── parser-service/          # Data parsing service
├── soil-data-ms/            # Soil data microservice
├── weather-data-ms/         # Weather data microservice
├── sample-device-script/    # Sample script to simulate IoT device
├── docker-compose.yml       # Docker configuration
└── README.md                # This file
```

## Setup and Installation

1. Install Docker and Docker Compose if you haven't already
2. Clone this repository
3. Run the following command to start all services:

```bash
docker-compose up -d
```

## Sample Usage

The project includes a sample script that simulates an IoT device sending data to the MQTT broker. To run it:

```bash
cd sample-device-script
npm install
node sample-device.js
```

## Data Flow

1. IoT device sends data to MQTT broker (Aedes service)
2. MQTT broker publishes message to RabbitMQ
3. Parser service consumes the message, parses it, and forwards it to the appropriate queue
4. Soil or Weather microservice consumes the message and stores it in MongoDB

## Configuration

Each service has its own configuration files. See the individual service directories for more details. 