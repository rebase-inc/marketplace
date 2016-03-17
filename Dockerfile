FROM alpine:3.3
RUN apk add --update build-base python nodejs && \
    rm -rf /var/cache/apk/*
COPY package.json /deps/package.json
WORKDIR /deps
RUN npm install
WORKDIR /code
CMD if [ ! -e "node_modules" ]; then cp -r /deps/node_modules /code/. ; fi && npm start
