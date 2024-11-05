FROM node:20 AS build

WORKDIR /app

COPY package.json package.json
RUN npm install
COPY . .

ARG VITE_APP_UNSPLASH_ACCESS_KEY
ENV VITE_APP_UNSPLASH_ACCESS_KEY=${VITE_APP_UNSPLASH_ACCESS_KEY}

RUN npm run build

FROM nginx:alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]