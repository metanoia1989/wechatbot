
const { body, validationResult, query } = require('express-validator')
const { res_data } = require('../util/server');
const { WechatContact } = require('../models/wechat');
const { UserInfo } = require('../models/wavelib');
const { Op } = require('sequelize');
const { initAllContactData } = require('../service/syncData');

exports.validate = {
    findContact: [
        query('id').exists().isInt().withMessage('ID必须为正整数！'),
    ],
    listContact: [
        query('id').optional({ nullable: true }).isInt().withMessage('ID必须为正整数！'),
        query('page').optional({ nullable: true }).isInt().withMessage('页数必须为正整数！'),
        query('limit').optional({ nullable: true }).isInt().withMessage('每页条数必须为正整数！'),
        query('keyword').optional({ nullable: true }).notEmpty(),
    ],
}

/**
 * 群欢迎语列表
 *
 * @param {*} req 
 *            group_name 群组名
 * @param {*} res 
 * @param {*} next 
 */
exports.listContact = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg)) 
    }
    
    let where = {
        type: "personal",
    } 
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
        var items = await WechatContact.findAll({
            where, limit, offset, 
            include: UserInfo,
        })
        var total = await WechatContact.count({ where })
        var data = { items, total }
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }

    return res.json(res_data(data))
}

/**
 * 同步联系人数据
 *
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.syncContact = async (req, res, next) => {
    try {
        await initAllContactData()
        return res.json(res_data())
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }
}