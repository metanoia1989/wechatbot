const dispatch = require('./event-dispatch-service')
const { addRoom } = require('../service/index')

function emptyMsg() {
  let msgArr = [] // 返回的消息列表
  let obj = { type: 1, content: '我在呢', url: '' } // 消息主体
  msgArr.push(obj)
  return msgArr
}

function officialMsg() {
  console.log('字符超200字符，无效或官方消息，不做回复')
  return [{ type: 1, content: '', url: '' }]
}

function newFriendMsg({ config, name }) {
  console.log(`新添加好友：${name}，默认回复`)
  return config.newFriendReplys || [{ type: 1, content: '', url: '' }]
}

async function roomInviteMsg({ that, msg, contact, config }) {
  for (const item of config.roomJoinKeywords) {
    if (item.reg === 2 && item.keywords.includes(msg)) {
      console.log(`精确匹配到加群关键词${msg},正在邀请用户进群`)
      await addRoom(that, contact, item.roomName, item.replys)
      return [{ type: 1, content: '', url: '' }]
    } else {
      for (let key of item.keywords) {
        if (msg.includes(key)) {
          console.log(`模糊匹配到加群关键词${msg},正在邀请用户进群`)
          await addRoom(that, contact, item.roomName, item.replys)
          return [{ type: 1, content: '', url: '' }]
        }
      }
    }
  }
  return []
}

/**
 * 获取事件处理返回的内容
 * @param {*} event 事件名
 * @param {*} msg 消息
 * @param {*} name 用户
 * @param {*} id 用户id
 * @param avatar 用户头像
 * @returns {String}
 */
async function eventMsg({ that, msg, name, id, avatar, config, room }) {
  for (let item of config.eventKeywords) {
    for (let key of item.keywords) {
      if ((item.reg === 1 && msg.includes(key)) || (item.reg === 2 && msg === key)) {
        msg = msg.replace(key, '')
        let res = await dispatch.dispatchEventContent(that, event, msg, name, id, avatar, room)
        return res
      }
    }
  }
  return []
}

/**
 * 关键词回复
 * @returns {Promise<*>}
 */
async function keywordsMsg({ msg, config }) {
  if (config.replyKeywords && config.replyKeywords.length > 0) {
    for (let item of config.replyKeywords) {
      if (item.reg === 2 && item.keywords.includes(msg)) {
        console.log(`精确匹配到关键词${msg},正在回复用户`)
        return item.replys
      } else if (item.reg === 1) {
        for (let key of item.keywords) {
          if (msg.includes(key)) {
            console.log(`模糊匹配到关键词${msg},正在回复用户`)
            return item.replys
          }
        }
      }
    }
  } else {
    return []
  }
}


module.exports = {
  emptyMsg,
  officialMsg,
  newFriendMsg,
  roomInviteMsg,
  eventMsg,
  keywordsMsg,
}
