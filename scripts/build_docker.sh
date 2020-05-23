#!/bin/bash

TAG="${1:-latest}"

echo "Image tag is $TAG"

rm -rf server/static
docker build -f Dockerfile -t finance_calculator:$TAG --rm .