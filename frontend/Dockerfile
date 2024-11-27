FROM node:20 AS build

WORKDIR /app

# Установка зависимостей
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Сборка проекта. Собранные файлы будут сохранены в папке /app/dist
RUN npm run build

FROM alpine:latest AS export-static

WORKDIR /app

# Создание папки /app/build 
RUN mkdir -p /app/build

# Копирование файлов из /app/dist (на стадии сборки) в /app/build
COPY --from=build /app/dist/* /app/build/

# Завершение работы контейнера
CMD ["echo", "Static files copied to /app/build"]

