FROM node:lts-buster
RUN git clone https://github.com/mlbbcommunity/Aamon-FL/root/mlbbcommunity
WORKDIR /root/mlbbcommunity
RUN yarn install
COPY . .
EXPOSE 9090
CMD ["npm", "start"]
