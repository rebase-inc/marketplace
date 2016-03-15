FROM alpine:3.3
RUN apk add --update nodejs && \
    rm -rf /var/cache/apk/*
WORKDIR /code
CMD npm install && npm start
