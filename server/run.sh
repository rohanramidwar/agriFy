#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting AgriFy IoT Agriculture Platform${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo -e "${RED}Docker is not installed. Please install Docker and try again.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose and try again.${NC}"
    exit 1
fi

# Parse command line arguments
DEV_MODE=false
REBUILD=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --dev)
      DEV_MODE=true
      shift
      ;;
    --rebuild)
      REBUILD=true
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo "Usage: ./run.sh [--dev] [--rebuild]"
      echo "  --dev     : Run in development mode (only infrastructure services)"
      echo "  --rebuild : Force rebuild of Docker images"
      exit 1
      ;;
  esac
done

# Function to start services
start_services() {
  if [ "$REBUILD" = true ]; then
    echo -e "${YELLOW}Building and starting containers with rebuild...${NC}"
    docker-compose up -d --build
  else
    echo -e "${YELLOW}Building and starting containers...${NC}"
    docker-compose up -d
  fi
}

# Function to start only infrastructure services (for development)
start_dev_services() {
  echo -e "${YELLOW}Starting infrastructure services only (development mode)...${NC}"
  docker-compose up -d mongodb rabbitmq
}

# Main execution
if [ "$DEV_MODE" = true ]; then
  start_dev_services
else
  start_services
fi

echo -e "${YELLOW}Waiting for services to start up...${NC}"
sleep 10

echo -e "${GREEN}System is up and running!${NC}"
echo -e "${GREEN}RabbitMQ Management UI: http://localhost:15672/ (admin/password)${NC}"
echo -e "${GREEN}MongoDB: localhost:27027${NC}"

if [ "$DEV_MODE" = false ]; then
  echo -e "${GREEN}MQTT Broker: localhost:1883${NC}"
  echo -e "${GREEN}Soil Data API: http://localhost:3001/api/soil-data${NC}"
  echo -e "${GREEN}Weather Data API: http://localhost:3002/api/weather-data${NC}"
else
  echo -e "${YELLOW}Development mode: Only infrastructure services are running.${NC}"
  echo -e "${YELLOW}To run the aedes-service locally:${NC}"
  echo -e "cd aedes-service"
  echo -e "npm install"
  echo -e "npm run dev"
  
  echo -e "${YELLOW}To run the parser-service locally:${NC}"
  echo -e "cd parser-service"
  echo -e "npm install"
  echo -e "npm run dev"
  
  echo -e "${YELLOW}To run the soil-data-ms locally:${NC}"
  echo -e "cd soil-data-ms"
  echo -e "npm install"
  echo -e "npm run dev"
  
  echo -e "${YELLOW}To run the weather-data-ms locally:${NC}"
  echo -e "cd weather-data-ms"
  echo -e "npm install"
  echo -e "npm run dev"
fi

echo ""
echo -e "${YELLOW}To run the sample device script:${NC}"
echo "cd sample-device-script"
echo "npm install"
echo "node sample-device.js"

echo ""
echo -e "${YELLOW}To stop the system:${NC}"
echo "docker-compose down" 