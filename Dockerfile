FROM node:16 as build

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build -- --configuration production && ls -l /app/dist/SalesSystemAPP

FROM nginx:alpine

COPY --from=build /app/dist/SalesSystemAPP /usr/share/nginx/html
