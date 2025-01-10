FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine

# Копирование кастомного конфигурационного файла Nginx (опционально)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копирование собранных файлов в директорию Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Открытие порта 80
EXPOSE 80

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]