# Node.js 22
FROM node:22-alpine

# Устанавливаем PM2 глобально
RUN npm install -g pm2

# Рабочая папка
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем prod зависимости
RUN npm install --production

# Копируем исходники сервера
COPY . .

# Пробрасываем порт сервера
EXPOSE 3000

# Запуск через PM2
CMD ["pm2-runtime", "ecosystem.config.cjs"]