# build
FROM node:22-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .

RUN npm run build

# produção (Nginx)
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# 👇 ADICIONE ISSO
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]