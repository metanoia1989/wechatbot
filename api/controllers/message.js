//**************************************************************** 
// restapi，传入参数，借助微信bot来向群组和个人推送消息
//**************************************************************** 
const Bot = require('../bot');
const { body, validationResult } = require('express-validator')
const { res_data, delay } = require('../util/server');
const { WechatToGroup } = require('../models/wechat');

exports.validate = {
    sendMsgToRoom: [
        body('room_ident', '发送消息给群组微信群，必须指定room_ident！').exists(),
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
 * @param {*} res 
 * @param {*} next 
 */
exports.sendMsgToRoom = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg)) 
    }
    var param = { id: req.body.room_ident}
    var room = await Bot.getInstance().Room.find(param);
    if (!room) {
        return res.json(res_data(null, -1, "群组不存在！")) 
    }
    await room.say(req.body.content)
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
    var room_idents = await WechatToGroup.findAll({
        attributes: ['room_ident'],
        where: { groupid: req.body.groupid }
    })
    if (!room_idents) {
        return res.json(res_data(null, -1, "此分馆不存在关联的微信群，请在后台手动设置！")) 
    }
    room_idents.forEach(async ({ room_ident })=> {
        var param = { id: room_ident}
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