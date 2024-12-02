FROM node:20 AS build

WORKDIR /app

# Копируем только package.json
COPY package.json ./

# Устанавливаем зависимости и создаем package-lock.json
RUN npm install

# Устанавливаем зависимости с использованием package-lock.json (он был создан на предыдущем шаге)
RUN npm ci

# Установка зависимостей
RUN npm install -g npm@latest

# Копируем все файлы (включая package-lock.json)
COPY . .

# Сборка проекта. Папка dist будет создана в /app
RUN npm run build

FROM alpine:latest AS export-static

WORKDIR /app

# Создание папки /app/build 
RUN mkdir -p /app/build

# Копирование файлов из /app/dist (со стадии сборки) в /app/build
COPY --from=build /app/dist/. /app/build/

# Завершение работы контейнера
CMD ["echo", "Static files copied to /app/build"]

