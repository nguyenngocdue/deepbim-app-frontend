#!/bin/bash

echo "⚙️ Deploy Beta..."
git pull
docker-compose -f .docker_202/docker-compose202.yml down --remove-orphans 
# docker-compose -f .docker_202/docker-compose202.yml up -d --build
docker-compose -f .docker_202/docker-compose202.yml up -d 
echo "✅ Beta Deployed!"
