import Bot from "../bot.js";
import * as expressValidator from "express-validator";
import { res_data } from "../util/server.js";
import { WechatKeyword } from "../models/wechat-common.js";
import { Op } from "sequelize";
import { processKeyword } from "../util/wechat.js";
const { body, validationResult, oneOf, query } = expressValidator;
const keywordOption = [
    body('type').optional({ nullable: true }).isIn([1, 2, 3]),
    body('reply').optional({ nullable: true }),
    body('event').optional({ nullable: true }),
    body('status').optional({ nullable: true }).isIn([0, 1, true, false]),
];
export const validate = {
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
};
export const listKeyword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    let where = {};
    if (req.query.id) {
        where.id = req.query.id;
    }
    else if (req.query.keyword) {
        where.keyword = {
            [Op.substring]: req.query.keyword
        };
    }
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let offset = (page - 1) * limit;
        var items = await WechatKeyword.findAll({
            where, limit, offset,
        });
        items = items.map(processKeyword);
        var total = await WechatKeyword.count({ where });
        var data = { items, total };
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const findKeyword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    try {
        var data = await WechatKeyword.findByPk(req.query.id);
        if (data)
            data = processKeyword(data);
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const saveKeyword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    var keyword = req.body.keyword;
    var keywordRow = await WechatKeyword.findOne({
        where: { keyword }
    });
    if (keywordRow) {
        return res.json(res_data(null, -1, "添加失败，已存在此关键词!"));
    }
    try {
        await WechatKeyword.create(req.body);
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};
export const updateKeyword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    var where = {};
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id;
        delete req.body.id;
    }
    else {
        where.keyword = req.body.keyword;
        delete req.body.keyword;
    }
    try {
        await WechatKeyword.update({ ...req.body }, { where });
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};
export const deleteKeyword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    if (req.body.id && req.body.id == 1) {
        return res.json(res_data(null, -1, "默认关键词不允许删除"));
    }
    var where = {};
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id;
        delete req.body.id;
    }
    else {
        where.keyword = req.body.keyword;
        delete req.body.keyword;
    }
    try {
        await WechatKeyword.destroy({ where });
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};
