import * as expressValidator from "express-validator";
import { res_data } from "../util/server.js";
import { WechatContact, WechatFriendWelcome } from "../models/wechat.js";
import { UserInfo } from "../models/wavelib.js";
import { Op } from "sequelize";
import { initAllContactData } from "../service/syncData.js";
import { processKeyword } from "../util/wechat.js";
const { body, validationResult, query } = expressValidator;
const welcomeOption = [
    body('content').notEmpty().exists().withMessage('回复内容不能为空！'),
    body('status').optional({ nullable: true }).isIn([0, 1, true, false]),
];
export const validate = {
    findContact: [
        query('id').exists().isInt().withMessage('ID必须为正整数！'),
    ],
    listContact: [
        query('id').optional({ nullable: true }).isInt().withMessage('ID必须为正整数！'),
        query('page').optional({ nullable: true }).isInt().withMessage('页数必须为正整数！'),
        query('limit').optional({ nullable: true }).isInt().withMessage('每页条数必须为正整数！'),
        query('keyword').optional({ nullable: true }).notEmpty(),
    ],
    findWelcome: [
        query('id').exists().isInt().withMessage('ID必须为正整数！'),
    ],
    updateWelcome: [
        body('id', 'ID必须为整数！').exists().isInt(),
        ...welcomeOption,
    ],
};
export const listContact = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    let where = {
        type: "personal",
    };
    if (req.query.id) {
        where.id = req.query.id;
    }
    else if (req.query.keyword) {
        where.name = {
            [Op.substring]: req.query.keyword
        };
    }
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let offset = (page - 1) * limit;
        var items = await WechatContact.findAll({
            where, limit, offset,
            include: UserInfo,
        });
        var total = await WechatContact.count({ where });
        var data = { items, total };
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const syncContact = async (req, res, next) => {
    try {
        await initAllContactData();
        return res.json(res_data());
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
};
export const findWelcome = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    try {
        var data = await WechatFriendWelcome.findByPk(req.query.id);
        if (data)
            data = processKeyword(data);
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const updateWelcome = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    var where = { id: req.body.id };
    delete req.body.id;
    try {
        await WechatFriendWelcome.update({ ...req.body }, { where });
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};
