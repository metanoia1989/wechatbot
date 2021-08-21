//**************************************************************** 
// restapi，传入参数，借助微信bot来向组和个人推送消息
//**************************************************************** 
const Bot = require('../bot');
const { body, validationResult, oneOf, query } = require('express-validator')
const { res_data } = require('../util/server');
const { WechatKeyword } = require('../models/wechat');
const { Op } = require('sequelize');
const { processKeyword } = require('../util/wechat');


const keywordOption = [
    body('type').optional({ nullable: true }).isIn([1, 2, 3]),
    body('reply').optional({ nullable: true }),
    body('event').optional({ nullable: true }),
    body('status').optional({ nullable: true }).isIn([0, 1, true, false]),
]
exports.validate = {
    findKeyword: [
        query('id').exists().isInt().withMessage('ID必须为正整数！'),
    ],
    listKeyword: [
        query('id').optional({ nullable: true }).isInt().withMessage('ID必须为正整数！'),
        query('page').optional({ nullable: true }).isInt().withMessage('页数必须为正整数！'),
        query('limit').optional({ nullable: true }).isInt().withMessage('每页条数必须为正整数！'),
        query('keyword').optional({ nullable: true }).notEmpty(),
    ],
    saveKeyword: [
        body('keyword').notEmpty().exists().withMessage('关键字不能为空！'),
        ...keywordOption,
    ],
    updateKeyword: [
        oneOf([
            body('id', 'ID必须为整数！').exists().isInt(),
            body('keyword').notEmpty().exists().withMessage('关键字不能为空！'),
        ]),
        ...keywordOption,
    ],
    deleteKeyword: [
        oneOf([
            body('id', 'ID必须为整数！').exists().isInt(),
            body('keyword').notEmpty().exists().withMessage('关键字不能为空！'),
        ]),
    ],
}

/**
 * 关键词列表
 *
 * @param {*} req 
 *            keyword_name 组名
 * @param {*} res 
 * @param {*} next 
 */
exports.listKeyword = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg))
    }

    let where = {}
    if (req.query.id) {
        where.id = req.query.id
    } else if (req.query.keyword) {
        where.keyword = {
            [Op.substring]: req.query.keyword
        }
    }

    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let offset = (page - 1) * limit;
        var items = await WechatKeyword.findAll({
            where, limit, offset, 
        })
        items = items.map(processKeyword)
        var total = await WechatKeyword.count({ where })
        var data = { items, total }
    } catch (error) {
        return res.json(res_data(null, -1, error.toString()))
    }

    return res.json(res_data(data))
}

/**
 *  关键词详情
 *
 * @param {*} req 
 *            id 关键词ID
 * @param {*} res 
 * @param {*} next 
 */
exports.findKeyword = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg))
    }

    try {
        var data = await WechatKeyword.findByPk(req.query.id)
        if (data) data = processKeyword(data)
    } catch (error) {
        return res.json(res_data(null, -1, error.toString()))
    }

    return res.json(res_data(data))
}


/**
 * 添加关键词
 *
 * @param {*} req 
 *            keyword_ident 组标识
 * @param {*} res 
 * @param {*} next 
 */
exports.saveKeyword = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg))
    }

    var keyword = req.body.keyword

    var keywordRow = await WechatKeyword.findOne({
        where: { keyword }
    })

    if (keywordRow) {
        return res.json(res_data(null, -1, "添加失败，已存在此关键词!"))
    }

    try {
        await WechatKeyword.create(req.body)
    } catch (error) {
        return res.json(res_data(null, -1, error.toString()))
    }

    return res.json(res_data())
}

/**
 * 更新关键词 
 *
 * @param {*} req 
 *            keyword 关键词
 * @param {*} res 
 * @param {*} next 
 */
exports.updateKeyword = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg))
    }

    var where = {}
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id
        delete req.body.id
    } else {
        where.keyword = req.body.keyword
        delete req.body.keyword
    }
    try {
        await WechatKeyword.update({ ...req.body }, { where })
    } catch (error) {
        return res.json(res_data(null, -1, error.toString()))
    }

    return res.json(res_data())
}

/**
 * 删除关键词 
 *
 * @param {*} req 
 *            keyword_ident 组名
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteKeyword = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg))
    }
    if (req.body.id && req.body.id == 1) {
        return res.json(res_data(null, -1, "默认关键词不允许删除"))
    }

    var where = {}
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id
        delete req.body.id
    } else {
        where.keyword = req.body.keyword
        delete req.body.keyword
    }
    try {
        await WechatKeyword.destroy({ where })
    } catch (error) {
        return res.json(res_data(null, -1, error.toString()))
    }

    return res.json(res_data())
}