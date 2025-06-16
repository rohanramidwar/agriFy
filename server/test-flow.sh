#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Testing data flow through the system...${NC}"

# Check if RabbitMQ is running
echo -e "\n${YELLOW}Checking RabbitMQ...${NC}"
curl -s -u admin:password http://localhost:15672/api/overview | grep -q "management_version" && echo "RabbitMQ is running" || echo "RabbitMQ is not running"

# Check MongoDB
echo -e "\n${YELLOW}Checking MongoDB...${NC}"
mongo --quiet --eval "db.version()" mongodb://admin:password@localhost:27027/admin || echo "MongoDB connection failed"

# Check if the MQTT broker is accepting connections
echo -e "\n${YELLOW}Checking MQTT broker...${NC}"
nc -z localhost 1883 && echo "MQTT broker is accepting connections" || echo "MQTT broker is not accepting connections"

# Check if the APIs are responding
echo -e "\n${YELLOW}Checking Soil Data API...${NC}"
curl -s http://localhost:3001/ | grep -q "Soil Data Microservice" && echo "Soil Data API is responding" || echo "Soil Data API is not responding"

echo -e "\n${YELLOW}Checking Weather Data API...${NC}"
curl -s http://localhost:3002/ | grep -q "Weather Data Microservice" && echo "Weather Data API is responding" || echo "Weather Data API is not responding"

echo -e "\n${GREEN}Test completed.${NC}" 