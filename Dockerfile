FROM node:20 as builder
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli
RUN npm install --force
RUN npm run build --prod
CMD ["npm", "start"]