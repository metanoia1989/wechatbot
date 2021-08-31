const Bot = require("../bot")
const axios = require('axios')
const { contactSay } = require("../service")

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

/**
 * 处理关键词
 * @param {Welcome} item
 * @param {boolean} show 是否是展示
 */
function processKeyword(item, show = true) {
    if (!item) return
    if (show) {
        item.status = item.status ? true : false;
    } else {
        item.status = item.status ? 1 : 0;
    }
    return item
}

/**
 * 发送入群邀请（群成员>39），直接将成员加入群
 */
async function addContactToRoom(room, contact) {
  let token = process.env.SIMPLEPAD_TOKEN
  let needInvate = (await room.memberAll()).length > 39
  let endpoint = needInvate ? 'inviteChatRoomMember' : 'addChatRoomMember'
  let url = `http://121.199.64.183:8877/api/v1/chatroom/${endpoint}?token=${token}`
  let params = needInvate ? {
    chatroom: room.id, // 群号
    userName: contact.id, // 被邀请人ID
  } : {
    chatroom: room.id,
    memberList: [contact.id],
    reason: "直接入群",
  }
  let res = await axios.post(url, params)
  console.log("邀请入群的API响应", needInvate, params, res.data)
  if (res.data.code != 0) {
    contactSay(contact, { type: 1, content: "加入失败：" + res.data.msg  })
    // throw new Error(res.data.msg)
  }
}

module.exports = {
    fetchContactType,
    fetchWeixin,
    processWelcome,
    getKeyUrl,
    processContact,
    processKeyword,
    addContactToRoom,
}

