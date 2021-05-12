// 获取 wechat 相关的信息
const Bot = require('../bot');
const { res_data, downloadAvatar } = require('../util/server');

exports.self = async (req, res, next) => {
    var user = Bot.getInstance().bot.userSelf();
    await user.sync()
    downloadAvatar(user)
    return res.json(res_data(user.payload)) 
}

exports.contactList = async (req, res, next) => {
    var contacts = await Bot.getInstance().Contact.findAll();
    return res.json(res_data(contacts)) 
}