#!/bin/bash
nginx -c /app/docker/nginx.conf
gunicorn server.api:app