FROM ubuntu:18.04
LABEL maintainer="burlaknastasia@gmail.com"

WORKDIR /app

COPY docker/get-pip.py      docker/get-pip.py
COPY requirements.txt       requirements.txt
COPY frontend/package.json  frontend/package.json

RUN apt-get update && apt-get install -y \
    python3.7 \
    python3-distutils \
    nginx \
    nodejs \
    npm

RUN python3.7 docker/get-pip.py && \
    pip3 install -r requirements.txt

RUN (cd frontend && npm i && npm cache clean --force)

COPY docker                 docker
COPY server                 server
COPY frontend              frontend

RUN (cd frontend && npm run-script build)


EXPOSE 8080
ENTRYPOINT ["docker/start_container.sh"]
