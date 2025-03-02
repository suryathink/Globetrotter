FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN ls && node -v
RUN npm install && npm install --save-dev @types/cors
RUN npm i
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]