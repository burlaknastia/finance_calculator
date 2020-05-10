#!/bin/bash
TAG="${1:-1.0.0}"
echo "Image tag is $TAG"
(cd frontend && npm run-script build)
docker build -f Dockerfile -t deposit_calculator:$TAG --rm .