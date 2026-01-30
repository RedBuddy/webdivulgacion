# ---- Build stage ----
# /app /usr /lib
FROM node:24.11.1-alpine3.21 AS build

# cd app
WORKDIR /app

#Dest /app
COPY package.json ./

# Instalar las dependencias (incluye devDependencies para Angular CLI)
RUN npm install

# Copiar el resto del proyecto y compilar
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine

# Angular build output
COPY --from=build /app/dist/inventario-lab/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]