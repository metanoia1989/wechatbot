import Bot from "../bot.js";
import * as expressValidator from "express-validator";
import { res_data } from "../util/server.js";
import { WechatRoom } from "../models/wechat.js";
import { pushJob } from "../util/queue.js";
import { msgArr } from "../util/lib.js";
import { roomSay } from "../service/index.js";
const { body, validationResult } = expressValidator;
export const validate = {
    sendMsgToRoom: [
        body('group_name', '发送消息给微信群，必须指定微信群名称！').exists(),
        body('content', '必须指定消息内容！').exists(),
        body('link_url').optional({ nullable: true }),
    ],
    sendMsgToGroup: [
        body('groupid', '发送消息给微澜分馆群，必须指定groupid！').exists(),
        body('content', '必须指定消息内容！').exists(),
        body('link_url').optional({ nullable: true }),
    ],
};
export const sendMsgToRoom = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    var topic = req.body.group_name;
    if (typeof req.body.name_type != 'undefined' && req.body.name_type == 1) {
        // 名称为正则表达式
        topic = new RegExp(`${req.body.group_name}`);
    }
    var param = { topic: topic };
    console.log('参数1', param)
    if (typeof req.body.send_all != 'undefined' && req.body.send_all == 1) {
        // 发送给所有匹配的微信群
        console.log('room.findAll')
        var rooms = await Bot.getInstance().Room.findAll(param);
    }
    else {
        console.log('room.find')
        var room = await Bot.getInstance().Room.find(param);
        var rooms = room ? [room] : [];
    }

    if (rooms.length == 0) {
        return res.json(res_data(null, -1, "群组不存在！"));
    }
    rooms.forEach(room => {
        var cb = async () => {
            if (typeof req.body.link_url != 'undefined') {
                let link = {
                    type: 4,
                    url: req.body.link_url,
                    content: req.body.content,
                    thumbnailUrl: req.body.thumbnailUrl ? req.body.thumbnailUrl : '',
                    description: req.body.description ? req.body.description : '',
                };
                await roomSay(room, null, link);
            }
            else {
                await room.say(req.body.content);
            }
        };
        pushJob(cb);
    });
    return res.json(res_data());
};
export const sendMsgToGroup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    var room_names = await WechatRoom.findAll({
        attributes: ['room_ident', 'name'],
        where: { groupid: req.body.groupid }
    });
    for (const key in room_names) {
        if (Object.hasOwnProperty.call(room_names, key)) {
            const { room_ident, name } = room_names[key];
            // var room = await Bot.getInstance().Room.load(room_ident)
            var room = await Bot.getInstance().Room.find({ topic: name });
            if (!room) {
                finish = true;
                return res.json(res_data(null, -1, `群组${name}不存在！`));
            }
            var cb = async () => {
                if (typeof req.body.link_url != 'undefined') {
                    let link = {
                        type: 4,
                        url: req.body.link_url,
                        content: req.body.content,
                        description: req.body.description ? req.body.description : '',
                    };
                    await roomSay(room, null, link);
                }
                else {
                    await room.say(req.body.content);
                }
            };
            pushJob(cb);
        }
    }
    return res.json(res_data());
};
