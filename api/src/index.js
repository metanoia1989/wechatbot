
// 初始化bot和web服务
import { Logger, DB } from "./util/index.js";
import redis from "./util/redis.js";
import Bot from "./bot.js";
import start_app_server from "./api.js";


const logger = new Logger().getInstance();
const db = new DB().getInstance();
const { redisCilent } = redis;
// 处理未捕获的Promise异常，一般是wechaty库的原因
process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error);
    console.error("出现异常了");
    logger.error(error);
});
Bot.getInstance();
start_app_server();
