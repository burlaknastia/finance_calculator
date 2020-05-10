#!/bin/bash
cd app
mkdir -p logs
nginx -c /app/docker/nginx.conf
gunicorn api:app --error-logfile /app/logs/gunicorn.log
