#!/bin/bash

if [ -n "$1" ]; then
  echo "You are running dev server with debug. Please, start frontend dev build"
  DEV_SERVER=1 FLASK_ENV=development FLASK_APP=server.api.py flask run --port=8000
else
  echo "You are running server with build static files"
  (cd frontend && npm run build)
  FLASK_APP=server.api.py flask run --port=8000
fi
