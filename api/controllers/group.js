//**************************************************************** 
// restapi，传入参数，借助微信bot来向群组和个人推送消息
//**************************************************************** 
const Bot = require('../bot');
const { body, validationResult, oneOf, query } = require('express-validator')
const { res_data, delay } = require('../util/server');
const { WechatRoomWelcome } = require('../models/wechat');
const { pushJob } = require('../util/queue');
const { Op } = require('sequelize');


const welcomeOption = [
    body('content').optional({ nullable: true }).isLength({ min: 5 }).withMessage('欢迎语必须大于5个字符！'),
    body('img_url').optional({ nullable: true }),
    body('link_title').optional({ nullable: true }).isLength({ max: 50, min: 5}),
    body('link_desc').optional({ nullable: true }).isLength({ max: 99, min: 5}),
    body('link_img').optional({ nullable: true }),
    body('link_url').optional({ nullable: true }),
    body('status').optional({ nullable: true }).isIn([0, 1]),
]
exports.validate = {
    listWelcome: [
        query('id').optional({ nullable: true }).isInt().withMessage('ID必须为正整数！'),
        query('page').optional({ nullable: true }).isInt().withMessage('页数必须为正整数！'),
        query('size').optional({ nullable: true }).isInt().withMessage('每页条数必须为正整数！'),
        query('keyword').optional({ nullable: true }).notEmpty(),
    ],
    saveWelcome: [
        body('group_name', '必须指定群名称！').notEmpty().exists(),
        ...welcomeOption,
    ],
    updateWelcome: [
        oneOf([
            body('id', 'ID必须为整数！').exists().isInt(),
            body('group_name', '必须指定群名称！').notEmpty().exists(),
        ]),
        ...welcomeOption,
    ],
    deleteWelcome: [
        oneOf([
            body('id', 'ID必须为整数！').exists().isInt(),
            body('group_name', '必须指定群名称！').notEmpty().exists(),
        ]),
    ]
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
    if (req.query.id) {
        where.id = req.query.id
    } else if (req.query.keyword) {
        where.group_name = {
            [Op.substring]: req.query.keyword
        }
    }

    
    try {
        let limit = req.query.size ? parseInt(req.query.size) : 10;
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let offset = (page - 1) * limit;
        var data = await WechatRoomWelcome.findAll({
            where, limit, offset
        })
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }

    return res.json(res_data(data))
}

/**
 * 添加群欢迎语
 *
 * @param {*} req 
 *            group_name 群组名
 * @param {*} res 
 * @param {*} next 
 */
exports.saveWelcome = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg)) 
    }
    
    var group_name = req.body.group_name
    
    var welcome = await WechatRoomWelcome.findOne({
        where: { group_name }
    })

    if (welcome) {
        return res.json(res_data(null, -1, "添加失败，此群已存在欢迎语!")) 
    }
    
    try {
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
 *            group_name 群组名
 * @param {*} res 
 * @param {*} next 
 */
exports.updateWelcome = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg)) 
    }
    
    var where = {}
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id
        delete req.body.id
    } else {
        where.group_name = req.body.group_name 
        delete req.body.group_name
    }
    try {
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
 *            group_name 群组名
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteWelcome = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg)) 
    }
    
    var where = {}
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id
        delete req.body.id
    } else {
        where.group_name = req.body.group_name 
        delete req.body.group_name
    }
    try {
        await WechatRoomWelcome.destroy({ where })
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }

    return res.json(res_data())
}