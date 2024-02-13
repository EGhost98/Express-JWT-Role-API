FROM node:20.11

WORKDIR /app

# Set the environment variable
ENV JWT_SECRET="4330133a0e7470e1dc2da7e6cd5068152f6882f5c86e0c17423571407d9e31d2"
ENV MONGODB_URI="mongodb+srv://admin:0ac26Mh31dM72Rov@cluster0.fp5tf8q.mongodb.net/"
ENV EMAIL_ADDRESS="aditya09proud@gmail.com"
ENV EMAIL_PASSWORD="bews oqqz fykz sprq"


COPY package*.json ./

RUN npm install

COPY ./server /app/backend

EXPOSE 3000

CMD ["node", "backend/app.js"]

# docker build -t express-jwt-api .
# docker run -p 3000:3000 express-jwt-api