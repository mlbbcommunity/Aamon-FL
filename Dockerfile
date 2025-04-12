FROM node:lts-buster
RUN git clone https://github.com/mlbbcommunity/Aamon-FL/root/mlbbcommunity
WORKDIR /root/mlbbcommunity
RUN npm install && npm install -g pm2 || yarn install --network-concurrency 1
COPY . .
EXPOSE 9090
CMD ["npm", "start"]
