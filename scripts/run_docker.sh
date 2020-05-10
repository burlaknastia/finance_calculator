#!/bin/bash
PORT="${1:-8000}"
echo "Docker run on port $PORT"
docker container run --publish $PORT:8080 --detach deposit_calculator:1.0.0