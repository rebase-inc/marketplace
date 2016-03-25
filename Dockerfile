FROM alpine:3.3
RUN apk add --update build-base python nodejs rsync && \
    rm -rf /var/cache/apk/*
COPY package.json /deps/package.json
WORKDIR /deps
RUN npm install
WORKDIR /code
CMD rsync -rlt /deps/node_modules/ /code/node_modules/ && npm start
