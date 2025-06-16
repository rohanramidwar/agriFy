#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Checking logs for all services...${NC}"

echo -e "\n${YELLOW}=== MQTT Broker (aedes-service) Logs ===${NC}"
ps aux | grep "aedes-service" | grep -v grep

echo -e "\n${YELLOW}=== Parser Service Logs ===${NC}"
ps aux | grep "parser-service" | grep -v grep

echo -e "\n${YELLOW}=== Soil Data Microservice Logs ===${NC}"
ps aux | grep "soil-data-ms" | grep -v grep

echo -e "\n${YELLOW}=== Weather Data Microservice Logs ===${NC}"
ps aux | grep "weather-data-ms" | grep -v grep

echo -e "\n${YELLOW}=== Sample Device Script Logs ===${NC}"
ps aux | grep "sample-device.js" | grep -v grep

echo -e "\n${GREEN}To see detailed logs for a specific service, use:${NC}"
echo "tail -f <service-directory>/logs/app.log (if available)" 