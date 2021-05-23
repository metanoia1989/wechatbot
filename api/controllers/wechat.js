// 获取 wechat 相关的信息
const Bot = require('../bot');
const { res_data, downloadAvatar } = require('../util/server');

exports.self = async (req, res, next) => {
    var user = Bot.getInstance().bot.userSelf();
    await user.sync()
    downloadAvatar(user)
    return res.json(res_data(user.payload)) 
}

//************************************************************
// 测试微信信息 Start
//************************************************************
exports.contactList = async (req, res, next) => {
    var contacts = await Bot.getInstance().Contact.findAll();
    return res.json(res_data(contacts)) 
}

exports.roomList = async (req, res, next) => {
    var param = {}
    if (req.query.id) {
        param.id = req.query.id 
    }
    var items = await Bot.getInstance().Room.findAll(param);
    return res.json(res_data(items)) 
}

exports.roomFind = async (req, res, next) => {
    var param = {}
    if (req.query.id) {
        param.id = req.query.id 
    }
    var item = await Bot.getInstance().Room.find(param);
    return res.json(res_data(item)) 
}

exports.roomOwner = async (req, res, next) => {
    const { topic } = req.query
    if (!topic) {
        return res.json(res_data(null, -1, "缺少参数")); 
    }
    var item = await Bot.getInstance().Room.find({ topic })
    return res.json(res_data(item.owner())) 
}

exports.roomAnnounce = async (req, res, next) => {
    const { announce, topic } = req.query
    if (!announce) {
        return res.json(res_data(null, -1, "缺少参数")); 
    }
    var item = await Bot.getInstance().Room.find({ topic })
    item.sync()
    await item.announce(announce)
    return res.json(res_data(item.owner())) 
}

exports.roomMemberAll = async (req, res, next) => {
    const { topic } = req.query
    if (!topic) {
        return res.json(res_data(null, -1, "缺少参数")); 
    }
    var item = await Bot.getInstance().Room.find({ topic })
    console.log(await item.topic())
    return res.json(res_data(await item.memberAll())) 
}
//************************************************************
// 测试微信信息 End
//************************************************************
    
