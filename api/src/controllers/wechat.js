import Bot from "../bot.js";
import memoryCache from "../util/memoryCache.js";
import { res_data, downloadAvatar } from "../util/server.js";
import * as QRcode from "qrcode";
import { redisClient } from "../util/redis.js";
const { get } = memoryCache;

export const self = async (req, res, next) => {
    var user = Bot.getInstance().currentUser;
    await user.sync();
    downloadAvatar(user);
    return res.json(res_data(user.payload));
};

export const loginStatus = async (req, res, next) => {
    var status = await Bot.getInstance().isLoggedIn;
    return res.json(res_data({ status }));
};

export const qrcode = async (req, res, next) => {
    var status = await Bot.getInstance().isLoggedIn;
    if (status) {
        return res.json(res_data(null, -1, "已登录微信号"));
    }
    var qrcode = get("qrcode");
    var url = await QRcode.toDataURL(qrcode);
    return res.json(res_data({ url }));
};

export const clearRedisCache = async (req, res, next) => {
    await redisClient.clearCache();
    return res.json(res_data());
};

export const contactList = async (req, res, next) => {
    var contacts = await Bot.getInstance().Contact.findAll();
    return res.json(res_data(contacts));
};

export const roomList = async (req, res, next) => {
    var param = {};
    if (req.query.id) {
        param.id = req.query.id;
    }
    var items = await Bot.getInstance().Room.findAll(param);
    return res.json(res_data(items));
};

export const roomFind = async (req, res, next) => {
    var param = {};
    if (req.query.id) {
        param.id = req.query.id;
    }
    var item = await Bot.getInstance().Room.find(param);
    return res.json(res_data(item));
};

export const roomOwner = async (req, res, next) => {
    const { topic } = req.query;
    if (!topic) {
        return res.json(res_data(null, -1, "缺少参数"));
    }
    var item = await Bot.getInstance().Room.find({ topic });
    return res.json(res_data(item.owner()));
};

export const roomAnnounce = async (req, res, next) => {
    const { announce, topic } = req.query;
    if (!announce) {
        return res.json(res_data(null, -1, "缺少参数"));
    }
    var item = await Bot.getInstance().Room.find({ topic });
    item.sync();
    await item.announce(announce);
    return res.json(res_data(item.owner()));
};

export const roomMemberAll = async (req, res, next) => {
    const { topic } = req.query;
    if (!topic) {
        return res.json(res_data(null, -1, "缺少参数"));
    }
    var item = await Bot.getInstance().Room.find({ topic });
    console.log(await item.topic());
    return res.json(res_data(await item.memberAll()));
};
