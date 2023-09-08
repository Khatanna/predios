FROM node:18

RUN mkdir -p /home/app/api
COPY . /home/app/api
RUN cd /home/app/api && npm i prisma -g && prisma generate && npm install --quiet
