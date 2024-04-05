FROM node:20.11-alpine as builder

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:20.11-alpine

ENV NODE_ENV production
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --from=builder /usr/src/app/dist ./dist
USER node

CMD [ "node", "dist/index.js" ]