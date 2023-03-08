// 全局配置文件

// 首先加载环境变量
import * as dotenv from "dotenv";
import { fileDirName } from "./util/server.js";
const { __dirname } = fileDirName(import.meta);
dotenv.config({ path: __dirname + '/../.env' });

// 配置信息 
export const static_dir = __dirname + '/public/';
export const images_dir = static_dir + "statics/images/";
export const avatar_dir = images_dir + "avatar/";


export default {
    static_dir,
    images_dir,
    avatar_dir,

    __dirname,

    APP_SECRET: process.env.APP_SECRET,
    APP_DEBUG: process.env.APP_DEBUG,
    APP_PORT: process.env.APP_PORT,
    APP_DOMAIN: process.env.APP_DOMAIN,

    PADLOCAL_TOKEN: process.env.PADLOCAL_TOKEN,
    WORKPRO_TOKEN: process.env.WORKPRO_TOKEN,

    DB_TYPE: process.env.DB_TYPE,
    DB_HOSTNAME: process.env.DB_HOSTNAME,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PREFIX: process.env.DB_PREFIX,
    DB_HOSTPORT: process.env.DB_HOSTPORT,
    DB_CHARSET: process.env.DB_CHARSET,

    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_DB: process.env.REDIS_DB,

    YIDI_USERNAME: process.env.YIDI_USERNAME,
    YIDI_PASSWORD: process.env.YIDI_PASSWORD,

    no_proxy: process.env.no_proxy,
};
