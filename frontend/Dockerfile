FROM node:20 AS build

WORKDIR /app

# Установка зависимостей
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Сборка проекта. Папка dist будет создана в /frontend
RUN npm run build

FROM alpine:latest AS export-static

WORKDIR /app

# Создание папки /app/build 
RUN mkdir -p /app/build

# Копирование файлов из /frontend/dist (на стадии сборки) в /app/build
COPY --from=build /app/frontend/dist/* /app/build/

# Завершение работы контейнера
CMD ["echo", "Static files copied to /app/build"]

