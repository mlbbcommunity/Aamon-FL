FROM node:lts-buster
RUN git clone https://github.com/mlbbcommunity/Aamon-FL.git
WORKDIR /root/ikmalvin
RUN yarn install --network-concurrency 1 && yarn global add pm2
COPY . .
EXPOSE 9090
CMD ["npm", "start"]
