#!/bin/bash

echo "⚙️ Deploy Beta..."
docker-compose -f .docker_202/docker-compose202.yml down --remove-orphans 
docker-compose -f .docker_202/docker-compose202.yml up -d --build
echo "✅ Beta Deployed!"
