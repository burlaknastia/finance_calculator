#!/bin/bash
echo $1
if [ -n "$1" ]; then
  echo "You are running dev server with debug. Please, start frontend dev build"
  (cd server && DEV_SERVER=1 PYTHONPATH='.' FLASK_ENV=development FLASK_APP=api.py flask run --port=8000)
else
  echo "You are running server with build static files"
  (cd frontend && npm run build)
  (cd server && PYTHONPATH='.' FLASK_APP=api.py flask run --port=8000)
fi
