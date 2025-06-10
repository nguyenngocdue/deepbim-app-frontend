#!/bin/bash
echo "Pull Code from GitHub..."
git pull
echo "⚙️ Deploy Production..."
docker-compose -f .docker_102/docker-compose102.yml down --remove-orphans 
docker-compose -f .docker_102/docker-compose102.yml up -d --build --no-cache
echo "✅ Beta Deployed!"

echo "✅ Show Dockers are running!"
docker ps 
