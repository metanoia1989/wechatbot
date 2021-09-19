const Redis = require('ioredis')

let {
  REDIS_HOST: host = "127.0.0.1",
  REDIS_PORT: port = 6379,
  REDIS_PASSWORD: password,
  REDIS_DB: db = 1,
} = process.env


const redisClient = new Redis({
  host, port, family: 4, db, password,
})

redisClient.clearCache = async function () {
  let keys = await this.keys('wechatbot:*')
  // Use pipeline instead of sending
  // one command each time to improve the
  // performance.
  var pipeline = this.pipeline();
  keys.forEach(function (key) {
    pipeline.del(key);
  });
  return await pipeline.exec();
}

module.exports = {
  redisClient,
}
