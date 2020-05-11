#!/bin/bash

TAG="1.0.0"
PORT="8000"

usage="Usage: ./$(basename "$0") [OPTIONS]

Run script to run docker container of calculator

OPTIONS:
    -h, --help              print this message
    -t, --tag string        tag of docker image to pull (default '1.0.0')
    -p, --port number       port to run docker container (default '8000')
"

while [ "$#" -gt 0 ]; do
  case "$1" in
  -t | --tag)
      TAG=${2}
      shift ;;
  -p | --port)
      PORT=${2}
      shift ;;
  -h | --help)
      echo "$usage"
      exit 0 ;;
  *)
      echo "$usage" >&2
      exit 1 ;;
  esac
  shift
done

echo "Docker image 'compound_interest_calculator' with tag $TAG"
echo "Docker run on port $PORT"

docker container run --publish $PORT:8080 --detach compound_interest_calculator:$TAG