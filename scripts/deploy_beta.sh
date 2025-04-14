#!/bin/bash
echo "Pull Code from GitHub..."
git pull
echo "⚙️ Deploy Beta..."
docker-compose -f .docker_202/docker-compose202.yml down --remove-orphans 
docker-compose -f .docker_202/docker-compose202.yml up -d --build
# docker-compose -f .docker_202/docker-compose202.yml up -d 
# docker-compose -f .docker_202/docker-compose202.yml build 
# docker-compose -f .docker_202/docker-compose202.yml restart

echo "✅ Beta Deployed!"

echo "✅ Show Dockers are running!"
docker ps 
