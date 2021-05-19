//**************************************************************** 
// restapi，传入参数，借助微信bot来向群组和个人推送消息
//**************************************************************** 
const Bot = require('../bot');
const { res_data, downloadAvatar } = require('../util/server');

exports.sendMsgToRoom = async (req, res, next) => {
    if (!req.query.groupid) {
        throw new Error("发送消息给群组微信群，必须指定groupid！")
    }
    var Room = await Bot.getInstance().Room.find({ id: req.query.id });

}