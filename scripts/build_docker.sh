#!/bin/bash

TAG="${1:-1.0.0}"

echo "Image tag is $TAG"

rm -rf server/static
docker build -f Dockerfile -t compound_interest_calculator:$TAG --rm .