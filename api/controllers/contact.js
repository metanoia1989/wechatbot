
const { body, validationResult, query } = require('express-validator')
const { res_data } = require('../util/server');
const { WechatContact, WechatFriendWelcome } = require('../models/wechat');
const { UserInfo } = require('../models/wavelib');
const { Op } = require('sequelize');
const { initAllContactData } = require('../service/syncData');
const { processKeyword } = require('../util/wechat');

const welcomeOption = [
  body('content').notEmpty().exists().withMessage('回复内容不能为空！'),
  body('status').optional({ nullable: true }).isIn([0, 1, true, false]),
]

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
  findWelcome: [
    query('id').exists().isInt().withMessage('ID必须为正整数！'),
  ],
  updateWelcome: [
    body('id', 'ID必须为整数！').exists().isInt(),
    ...welcomeOption,
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



/**
 * 好友欢迎语详情
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
    var data = await WechatFriendWelcome.findByPk(req.query.id)
    if (data) data = processKeyword(data)
  } catch (error) {
    return res.json(res_data(null, -1, error.toString()))
  }

  return res.json(res_data(data))
}

/**
 * 更新好友欢迎语
 *
 * @param {*} req
 *            content 内容
 * @param {*} res
 * @param {*} next
 */
exports.updateWelcome = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.json(res_data(errors, -1, errors.errors[0].msg))
  }

  var where = { id: req.body.id }
  delete req.body.id

  try {
    await WechatFriendWelcome.update({ ...req.body }, { where })
  } catch (error) {
    return res.json(res_data(null, -1, error.toString()))
  }

  return res.json(res_data())
}
