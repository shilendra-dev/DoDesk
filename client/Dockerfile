# Use Node.js as the base image
FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the frontend (for Next.js/React)
RUN npm run build

EXPOSE 3000 
CMD ["npm", "start"]