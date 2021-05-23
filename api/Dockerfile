FROM wechaty/wechaty
ENTRYPOINT []
WORKDIR /bot
COPY package.json .
RUN npm config set registry http://registry.npm.taobao.org && npm install 
CMD node index.js