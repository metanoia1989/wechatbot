//**************************************************************** 
// restapi，传入参数，借助微信bot来向群组和个人推送消息
//**************************************************************** 
const Bot = require('../bot');
const { body, validationResult, oneOf, query } = require('express-validator')
const { res_data, delay } = require('../util/server');
const { WechatRoomWelcome, WechatRoom } = require('../models/wechat');
const { pushJob } = require('../util/queue');
const { Op } = require('sequelize');
const { Group } = require('../models/wavelib');
const { initAllRoomData } = require('../service/syncData');


const welcomeOption = [
    body('content').optional({ nullable: true }).isLength({ min: 5 }).withMessage('欢迎语必须大于5个字符！'),
    body('img_url').optional({ nullable: true }),
    body('link_title').optional({ nullable: true }),
    body('link_desc').optional({ nullable: true }),
    body('link_img').optional({ nullable: true }),
    body('link_url').optional({ nullable: true }),
    body('status').optional({ nullable: true }).isIn([0, 1, true, false]),
]
exports.validate = {
    findWelcome: [
        query('id').exists().isInt().withMessage('ID必须为正整数！'),
    ],
    listWelcome: [
        query('id').optional({ nullable: true }).isInt().withMessage('ID必须为正整数！'),
        query('page').optional({ nullable: true }).isInt().withMessage('页数必须为正整数！'),
        query('limit').optional({ nullable: true }).isInt().withMessage('每页条数必须为正整数！'),
        query('keyword').optional({ nullable: true }).notEmpty(),
    ],
    saveWelcome: [
        body('group_ident', '必须指定群标识！').notEmpty().exists(),
        ...welcomeOption,
    ],
    updateWelcome: [
        oneOf([
            body('id', 'ID必须为整数！').exists().isInt(),
            body('group_ident', '必须指定群标识！').notEmpty().exists(),
        ]),
        ...welcomeOption,
    ],
    deleteWelcome: [
        oneOf([
            body('id', 'ID必须为整数！').exists().isInt(),
            body('group_ident', '必须指定群标识！').notEmpty().exists(),
        ]),
    ],
    listRoom: [
        query('id').optional({ nullable: true }).isInt().withMessage('ID必须为正整数！'),
        query('page').optional({ nullable: true }).isInt().withMessage('页数必须为正整数！'),
        query('limit').optional({ nullable: true }).isInt().withMessage('每页条数必须为正整数！'),
        query('keyword').optional({ nullable: true }).notEmpty(),
    ],
    relateRoomLibrary: [
        body('room_id', 'ID必须为整数！').exists().isInt(),
        body('groupid', '群组id必须为整数！').exists().isInt(),
    ],
}

/**
 * 处理欢迎语
 * @param {Welcome} item 
 * @param {boolean} show 是否是展示
 */
function processWelcome(item, show = true) {
    if (show) {
        item.status = item.status ? true : false;
    } else {
        item.status = item.status ? 1 : 0 ;
    }
    return item
}

/**
 * 群欢迎语列表
 *
 * @param {*} req 
 *            group_name 群组名
 * @param {*} res 
 * @param {*} next 
 */
exports.listWelcome = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg)) 
    }
    
    let where = {} 
    let include = {}
    if (req.query.id) {
        where.id = req.query.id
    } else if (req.query.keyword) {
        include = {
          include: [{
              model: WechatRoom,
              attributes: [],
              where: {
                name: {
                    [Op.substring]: req.query.keyword
                }
              }
          }],
        } 
    }
    
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let offset = (page - 1) * limit;
        var items = await WechatRoomWelcome.findAll({
            where, limit, offset, ...include
        })
        items = items.map(processWelcome)
        var total = await WechatRoomWelcome.count({ where })
        var data = { items, total }
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }

    return res.json(res_data(data))
}

/**
 *  欢迎语详情
 *
 * @param {*} req 
 *            id 欢迎语ID
 * @param {*} res 
 * @param {*} next 
 */
exports.findWelcome = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg)) 
    }
    
    try {
        var data = await WechatRoomWelcome.findByPk(req.query.id)
        if (data) data = processWelcome(data)
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }

    return res.json(res_data(data))
}


/**
 * 添加群欢迎语
 *
 * @param {*} req 
 *            group_ident 群组标识
 * @param {*} res 
 * @param {*} next 
 */
exports.saveWelcome = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg)) 
    }
    
    var group_ident = req.body.group_ident
    
    var welcome = await WechatRoomWelcome.findOne({
        where: { group_ident }
    })

    if (welcome) {
        return res.json(res_data(null, -1, "添加失败，此群已存在欢迎语!")) 
    }
    
    try {
        if (req.body.status) {
            req.body = processWelcome(req.body, false)
        }
        await WechatRoomWelcome.create(req.body)
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }

    return res.json(res_data())
}

/**
 * 更新群欢迎语 
 *
 * @param {*} req 
 *            group_ident 群组标识
 * @param {*} res 
 * @param {*} next 
 */
exports.updateWelcome = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg)) 
    }
    
    var where = {}
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id
        delete req.body.id
    } else {
        where.group_ident = req.body.group_ident
        delete req.body.group_ident
    }
    try {
        if (req.body.status) {
            req.body = processWelcome(req.body, false)
        }
        await WechatRoomWelcome.update({ ...req.body }, { where })
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }

    return res.json(res_data())
}

/**
 * 删除群欢迎语 
 *
 * @param {*} req 
 *            group_ident 群组名
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteWelcome = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg)) 
    }
    if (req.body.id && req.body.id == 1) {
        return res.json(res_data(null, -1, "默认欢迎语不允许删除")) 
    }
    
    var where = {}
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id
        delete req.body.id
    } else {
        where.group_ident = req.body.group_ident
        delete req.body.group_ident
    }
    try {
        await WechatRoomWelcome.destroy({ where })
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }

    return res.json(res_data())
}

/**
 * 群列表
 *
 * @param {*} req 
 *            group_name 群组名
 * @param {*} res 
 * @param {*} next 
 */
exports.listRoom = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg)) 
    }
    
    let where = {} 
    if (req.query.id) {
        where.id = req.query.id
    } else if (req.query.keyword) {
        where.name = {
            [Op.substring]: req.query.keyword
        } 
    }

    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let offset = (page - 1) * limit;
        var items = await WechatRoom.findAll({
            where, limit, offset,
            include: Group
        })
        var total = await WechatRoom.count({ where })
        var data = { items, total }
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }

    return res.json(res_data(data))
}

/**
 * 同步群组数据
 *
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.syncRoom = async (req, res, next) => {
    try {
        await initAllRoomData()
        return res.json(res_data())
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }
}

/**
 * 微澜分馆列表
 *
 * @param {*} req 
 *            group_name 群组名
 * @param {*} res 
 * @param {*} next 
 */
exports.listLibrary = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg)) 
    }
    let where = {} 
    if (req.query.keyword) {
        where.groupname = {
            [Op.substring]: req.query.keyword
        } 
    }

    try {
        var items = await Group.findAll({ where })
        items = items.map((item) => {
            item.photo = Group.processPhoto(item.photo)
            return item
        })
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }

    return res.json(res_data(items))
}

/**
 * 关联分馆到群组
 *
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.relateRoomLibrary = async (req, res, next) => {
    try {
        const { room_id: id, groupid } = req.body
        await WechatRoom.update({ groupid }, { where: { id } })
        return res.json(res_data())
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }
}
