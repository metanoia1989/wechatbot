const Bot = require("../bot")
const { WechatContact } = require("../models/wechat")

function fetchContactType(contactPayload) {
    let id = contactPayload.id 
    if (id.startsWith("gh_")) {
        return 'official'
    } 
    return 'personal'
}

/**
 * 提取微信号
 * @param {Object} contactPayload 
 * @returns string
 */
function fetchWeixin(contactPayload) {
    let weixin = contactPayload.alias
    let id = contactPayload.id
    if (!weixin && !id.startsWith("gh_") && !id.startsWith("wxid_")) {
        weixin = id
    }
    return weixin
}

/**
 * 处理欢迎语
 * @param {Welcome} item 
 * @param {boolean} show 是否是展示
 */
function processWelcome(item, show = true) {
    if (!item) return 
    if (item.link_img) {
        item.link_img.key = getKeyUrl(item.link_img.key)
    }
    if (item.img) {
        item.img.key = getKeyUrl(item.img.key)
    }
    if (show) {
        item.status = item.status ? true : false;
    } else {
        item.status = item.status ? 1 : 0;
    }
    return item
}

// 文件处理函数
function getKeyUrl(key) {
    const appDomain = process.env.APP_DOMAIN
    return appDomain + key;
}

/**
 * 处理联系人数据，方便入库 
 * @param {Contact} contact 
 * @returns Ocontact => { }
 */
function processContact(contact)  {
    let { payload } = contact
    if (typeof payload.id == 'undefined') {
        payload.id = contact.id
    }
    var type = fetchContactType(payload)
    var weixin = fetchWeixin(payload)
    var contact_ident = payload.id
    delete payload.id
    var self_id = Bot.getInstance().bot.userSelf().id
    return {
        ...payload,
        contact_ident,
        friend: payload.friend ? 1 : 0,
        star: payload.star ? 1 : 0,
        self: payload.id == self_id ? 1 : 0,
        type: type,
        // signature: payload.signature.replace("'",""),
        name: payload.name.replace("'",""),
        weixin, 
    }
}

module.exports = {
    fetchContactType,
    fetchWeixin,
    processWelcome,
    getKeyUrl,
    processContact,
}