FROM ubuntu:18.04
LABEL maintainer="burlaknastasia@gmail.com"

COPY requirements.txt       /app/requirements.txt
COPY docker                 /app/docker
COPY server/                /app

RUN apt-get update && \
    apt-get install -y python3.7 python3-distutils nginx && \
    python3.7 /app/docker/get-pip.py && \
    pip3 install -r /app/requirements.txt

EXPOSE 8080
ENTRYPOINT ["/app/docker/start_container.sh"]
