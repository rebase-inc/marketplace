FROM node
ENV NPM_CONFIG_PREFIX /vendor
ADD package.json ${NPM_CONFIG_PREFIX}/package.json
RUN npm install
WORKDIR /code
