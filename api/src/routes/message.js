import * as express from "express";
import * as msgController from "../controllers/message.js";
const router = express.Router();
/**
 * 消息发送请求体
 * @typedef {object} MsgRequest
 * @property {string} group_name.required - 微信群名
 * @property {string} content.required - 消息内容
 * @property {string} link_url - 内容链接
 * @property {string} description - 内容描述
 * @property {integer} name_type - enum:0,1 - 群名匹配模式
 * @property {integer} send_all - 是否发送给所有匹配的群
 */
/**
 * POST /message/sendMsgToRoom
 * @summary 接收微信群名，发送消息给群
 * @tags message
 * @param {MsgRequest} request.body.required - 消息发送请求 - application/x-www-form-urlencoded
 * @return {object} 200 - 消息发送成功响应
 * @example request - 发送给微信测试群消息
 * {
 *   "groupname": "微信机器人测试1群",
 *   "content": "今天是个好日子！"
 * }
 * @example request - 消息卡片发送测试
 * {
 *   "groupname": "微信机器人测试1群",
 *   "content": "今天是个好日子！",
 *   "description": "披荆斩棘，冲锋陷阵",
 *   "link_url": "http://park.sanzhi.org.cn"
 * }
 * @example response - 200 - 消息发送成功
 * {
 *   "code": 0,
 *   "msg": "success"
 * }
 */
router.post('/sendMsgToRoom', msgController.validate.sendMsgToRoom, msgController.sendMsgToRoom);
/**
 * POST /message/sendMsgToGroup
 * @summary 发送消息给微澜分馆关联的群组，当有多个关联时，也进行发送
 * @tags message
 * @param {string} groupid.form.required - 分馆ID - application/x-www-form-urlencoded
 * @param {string} content.form.required - 消息内容 - application/x-www-form-urlencoded
 * @return {object} 200 - 消息发送成功
 * @example response - 200 - 消息发送成功
 * {
 *   "code": 0,
 *   "msg": "success"
 * }
 */
router.post('/sendMsgToGroup', msgController.validate.sendMsgToGroup, msgController.sendMsgToGroup);
export default router;
