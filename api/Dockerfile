FROM node:18

WORKDIR /app

COPY package*.json .
RUN npm install
RUN npx prisma init --datasource-provider mysql

COPY . .

EXPOSE 5001

CMD npm run dev
