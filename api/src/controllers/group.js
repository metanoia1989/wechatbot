import Bot from "../bot.js";
import * as expressValidator from "express-validator";
import { res_data } from "../util/server.js";
import { WechatRoomWelcome, WechatRoom, WechatFile } from "../models/wechat.js";
import { Op } from "sequelize";
import { Group } from "../models/wavelib.js";
import { initAllRoomData } from "../service/syncData.js";
import * as file from "./file.js";
import { processWelcome } from "../util/wechat.js";
const { body, validationResult, oneOf, query } = expressValidator;
const { getKeyUrl } = file;
const welcomeOption = [
    body('content').optional({ nullable: true }).isLength({ min: 5 }).withMessage('欢迎语必须大于5个字符！'),
    body('img_id').optional({ nullable: true }),
    body('link_title').optional({ nullable: true }),
    body('link_desc').optional({ nullable: true }),
    body('link_img_id').optional({ nullable: true }),
    body('link_url').optional({ nullable: true }),
    body('status').optional({ nullable: true }).isIn([0, 1, true, false]),
];
export const validate = {
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
        body('room_ident', '必须指定群标识！').notEmpty().exists(),
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
};
export const listWelcome = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    let where = {};
    let include = {
        include: [
            WechatRoom,
            { model: WechatFile, as: 'link_img' },
            { model: WechatFile, as: 'img' },
        ]
    };
    if (req.query.id) {
        where.id = req.query.id;
    }
    else if (req.query.keyword) {
        include = {
            include: [{
                    model: WechatRoom,
                    attributes: [],
                    where: {
                        name: {
                            [Op.substring]: req.query.keyword
                        }
                    }
                },
                { model: WechatFile, as: 'link_img' },
                { model: WechatFile, as: 'img' },
            ],
        };
    }
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let offset = (page - 1) * limit;
        var items = await WechatRoomWelcome.findAll({
            where, limit, offset, ...include
        });
        items = items.map(processWelcome);
        var total = await WechatRoomWelcome.count({ where });
        var data = { items, total };
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const findWelcome = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    try {
        var data = await WechatRoomWelcome.findByPk(req.query.id);
        if (data)
            data = processWelcome(data);
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const saveWelcome = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg));
    }
    var room_ident = req.body.room_ident;
    var welcome = await WechatRoomWelcome.findOne({
        where: { room_ident }
    });
    if (welcome) {
        return res.json(res_data(null, -1, "添加失败，此群已存在欢迎语!"));
    }
    try {
        if (req.body.status) {
            req.body = processWelcome(req.body, false);
        }
        await WechatRoomWelcome.create(req.body);
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};
export const updateWelcome = async (req, res, next) => {
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
        where.group_ident = req.body.group_ident;
        delete req.body.group_ident;
    }
    try {
        if (req.body.status) {
            req.body = processWelcome(req.body, false);
        }
        await WechatRoomWelcome.update({ ...req.body }, { where });
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};
export const deleteWelcome = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    if (req.body.id && req.body.id == 1) {
        return res.json(res_data(null, -1, "默认欢迎语不允许删除"));
    }
    var where = {};
    if (typeof req.body.id != "undefined") {
        where.id = req.body.id;
        delete req.body.id;
    }
    else {
        where.group_ident = req.body.group_ident;
        delete req.body.group_ident;
    }
    try {
        await WechatRoomWelcome.destroy({ where });
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data());
};
export const listRoom = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    let where = {};
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
        var items = await WechatRoom.findAll({
            where, limit, offset,
            include: Group
        });
        var total = await WechatRoom.count({ where });
        var data = { items, total };
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(data));
};
export const allRoom = async (req, res, next) => {
    try {
        var items = await WechatRoom.findAll();
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(items));
};
export const syncRoom = async (req, res, next) => {
    try {
        await initAllRoomData();
        return res.json(res_data());
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
};
export const listLibrary = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg));
    }
    let where = {};
    if (req.query.keyword) {
        where.groupname = {
            [Op.substring]: req.query.keyword
        };
    }
    try {
        var items = await Group.findAll({ where });
        items = items.map((item) => {
            item.photo = Group.processPhoto(item.photo);
            return item;
        });
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
    return res.json(res_data(items));
};
export const relateRoomLibrary = async (req, res, next) => {
    try {
        const { room_id: id, groupid } = req.body;
        await WechatRoom.update({ groupid }, { where: { id } });
        return res.json(res_data());
    }
    catch (error) {
        return res.json(res_data(null, -1, error.toString()));
    }
};
