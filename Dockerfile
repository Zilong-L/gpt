FROM node:18.15.0
WORKDIR /app
COPY . .
RUN npm install 
RUN npm run build
CMD ["npm", "run", "start"]
EXPOSE 3000
