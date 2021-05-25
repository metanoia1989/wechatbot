//**************************************************************** 
// restapi，传入参数，借助微信bot来向群组和个人推送消息
//**************************************************************** 
const Bot = require('../bot');
const { body, validationResult } = require('express-validator')
const { res_data, delay } = require('../util/server');
const { wechatRoomToGroup, WechatRoomNames, WechatRoomToGroup } = require('../models/wechat');
const { getToday } = require('../util/datetime');

exports.validate = {
    sendMsgToRoom: [
        body('group_name', '发送消息给微信群，必须指定微信群名称！').exists(),
        body('content', '必须指定消息内容！').exists(),
    ],
    sendMsgToGroup: [
        body('groupid', '发送消息给微澜分馆群，必须指定groupid！').exists(),
        body('content', '必须指定消息内容！').exists(),
    ],
}

/**
 * 接收微信群组ID，发送消息给群 
 *
 * @param {*} req 
 *            group_name 群组名
 *            name_type 0 字符串 1 正则表达式
 *            send_all 0 单个群 1 所有匹配到的
 * @param {*} res 
 * @param {*} next 
 */
exports.sendMsgToRoom = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg)) 
    }
    var topic = req.body.group_name 
    if (typeof req.body.name_type != 'undefined' && req.body.name_type == 1) {
        // 名称为正则表达式
        topic = new RegExp(`${req.body.group_name}`) 
    }
    var param = { topic: topic }

    if (typeof req.body.send_all != 'undefined' && req.body.send_all == 1) {
        // 发送给所有匹配的微信群
        var rooms = await Bot.getInstance().Room.findAll(param);
    } else {
        var room = await Bot.getInstance().Room.findl(param)
        var rooms = room ? [room] : [];
    }
    if (rooms.length == 0) {
        return res.json(res_data(null, -1, "群组不存在！")) 
    }
    rooms.forEach(async room => {
        await room.say(req.body.content)
        delay(1000)
    })

    return res.json(res_data())
}

/**
 * 发送消息给微澜分馆关联的群组，当有多个关联时，也进行发送
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.sendMsgToGroup = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg)) 
    }
    var room_names = await WechatRoomNames.findAll({
        attributes: ['room_name'],
        include: {
            model: WechatRoomToGroup,
            attributes: [],
            where: { groupid: req.body.groupid }
        }
    })

    room_names.forEach(async ({ room_name })=> {
        var param = { topic: room_name }
        var room = await Bot.getInstance().Room.find(param);
        if (!room) {
            return res.json(res_data(null, -1, "群组不存在！")) 
        }
        console.log("发送消息给：", room.topic())
        await room.say(req.body.content)
        await delay(1000)
    });
    return res.json(res_data())
}