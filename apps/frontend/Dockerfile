FROM node:carbon

ARG version
ENV VERSION ${version}

WORKDIR /usr/src/app

COPY package*.json ./
COPY app_v${VERSION}.js app.js

RUN npm install

EXPOSE 5000
CMD [ "node", "app.js" ]

USER node

LABEL version="${version}"
