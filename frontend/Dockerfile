# FROM node:20 AS build

# WORKDIR /app

# COPY package.json package.json
# RUN npm install
# COPY . .

# ARG VITE_APP_UNSPLASH_ACCESS_KEY
# ARG VITE_BASE_URL
# ENV VITE_APP_UNSPLASH_ACCESS_KEY=${VITE_APP_UNSPLASH_ACCESS_KEY}
# ENV VITE_BASE_URL=${VITE_BASE_URL}

# RUN npm run build

# FROM nginx:alpine AS production

# COPY --from=build /app/dist /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

#Мои изменения
FROM node:20
WORKDIR /app

COPY package.json package.json
# Насколько я знаю мы еще должны тут копирнуть зависимости и из package-lock.json
RUN npm install


COPY . .
RUN npm run build
RUN npm install --global http-server

CMD ["npx", "-y", "http-server", "-p", "8000", "/app/build"]