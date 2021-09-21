FROM wechaty/wechaty

RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    libpng-dev \
    build-essential \
    g++

ENTRYPOINT []
WORKDIR /bot
COPY package.json .
RUN npm config set registry http://registry.npm.taobao.org

RUN apt-get install -y fonts-arkpandora  fonts-liberation fonts-liberation2
CMD npm install && npm install -g node-gyp
WORKDIR /bot/node_modules/canvas
CMD node-gyp rebuild
WORKDIR /bot

CMD npm install && node index.js
