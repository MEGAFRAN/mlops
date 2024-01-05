# Use the Alpine Linux image with Node.js
FROM node:21-alpine3.18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
