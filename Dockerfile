# 2. Etapa del Backend (Producción)
FROM node:22-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# Copiar el frontend ya compilado localmente al lugar correcto
COPY frontend/dist /app/frontend/dist

# Exponer el puerto del servidor
EXPOSE 5002

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
