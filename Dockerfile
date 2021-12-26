FROM node:latest as migration
WORKDIR .
COPY migrations ./migrations
COPY ./package.json .
RUN yarn install

FROM node:latest as back
WORKDIR .
COPY ./package.json .
RUN yarn install