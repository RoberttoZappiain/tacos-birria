# 1. Etapa de Construcción del Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 2. Etapa del Backend (Producción)
FROM node:18-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# Copiar el frontend ya compilado al lugar correcto
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Exponer el puerto del servidor
EXPOSE 5002

# Comando para iniciar la aplicación
CMD ["node", "server.js"]