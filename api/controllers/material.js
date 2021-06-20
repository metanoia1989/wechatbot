
const { body, validationResult, query } = require('express-validator')
const { res_data } = require('../util/server');
const { Op } = require('sequelize');
const { WechatMaterial } = require('../models/wechat');

exports.validate = {
    findMaterial: [
        query('id').exists().isInt().withMessage('ID必须为正整数！'),
    ],
    listMaterial: [
        query('id').optional({ nullable: true }).isInt().withMessage('ID必须为正整数！'),
        query('page').optional({ nullable: true }).isInt().withMessage('页数必须为正整数！'),
        query('limit').optional({ nullable: true }).isInt().withMessage('每页条数必须为正整数！'),
        query('keyword').optional({ nullable: true }).notEmpty(),
    ],
    saveMaterial: [
        body('title', '素材名称必填！').notEmpty().exists(),
        body('content', '素材内容必填！').notEmpty().exists(),
    ],
    updateMaterial: [
        body('id', 'ID必须为整数！').exists().isInt(),
        body('title', '素材名称必填！').optional({ nullable: true }).notEmpty(),
        body('content', '素材内容必填！').optional({ nullable: true }).notEmpty(),
    ],
    deleteMaterial: [
        body('id', 'ID必须为整数！').exists().isInt(),
    ],
}

/**
 * 素材列表
 *
 * @param {*} req 
 *            group_name 组名
 * @param {*} res 
 * @param {*} next 
 */
exports.listMaterial = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg)) 
    }
    
    let where = { } 
    if (req.query.id) {
        where.id = req.query.id
    } else if (req.query.keyword) {
        where.title = {
            [Op.substring]: req.query.keyword
        } 
    }
    
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let offset = (page - 1) * limit;
        var items = await WechatMaterial.findAll({
            where, limit, offset,
        })
        var total = await WechatMaterial.count({ where })
        var data = { items, total }
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }

    return res.json(res_data(data))
}

/**
 *  素材详情
 *
 * @param {*} req 
 *            id 素材ID
 * @param {*} res 
 * @param {*} next 
 */
exports.findMaterial = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg)) 
    }
    
    try {
        var data = await WechatMaterial.findByPk(req.query.id)
        if (data) data = processMaterial(data)
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }

    return res.json(res_data(data))
}


/**
 * 添加素材
 *
 * @param {*} req 
 *            title 组标识
 * @param {*} res 
 * @param {*} next 
 */
exports.saveMaterial = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg)) 
    }
    
    var title = req.body.title
    
    var material = await WechatMaterial.findOne({
        where: { title }
    })

    if (material) {
        return res.json(res_data(null, -1, "添加失败，此已存在素材!")) 
    }
    
    try {
        await WechatMaterial.create(req.body)
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }

    return res.json(res_data())
}

/**
 * 更新素材 
 *
 * @param {*} req 
 *            title 组标识
 * @param {*} res 
 * @param {*} next 
 */
exports.updateMaterial = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg)) 
    }
    
    var where = {}
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id
        delete req.body.id
    } else {
        where.title = req.body.title
        delete req.body.title
    }
    try {
        await WechatMaterial.update({ ...req.body }, { where })
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }

    return res.json(res_data())
}

/**
 * 删除素材 
 *
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteMaterial = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg)) 
    }
    
    var where = {}
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id
        delete req.body.id
    } else {
        where.title = req.body.title
        delete req.body.title
    }
    try {
        await WechatMaterial.destroy({ where })
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }

    return res.json(res_data())
}
