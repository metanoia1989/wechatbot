FROM wechaty/wechaty
ENTRYPOINT []
WORKDIR /bot
COPY package.json .
RUN npm config set registry http://registry.npm.taobao.org 
CMD npm install && node index.js