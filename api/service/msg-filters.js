const dispatch = require('./event-dispatch-service')
const { addRoom } = require('../service/index')
const { msgArr } = require('../util/lib')

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
    if (msg.startsWith(item.keyword)) {
      let room = await that.Room.find({ topic: msg })
      if (room) {
        console.log(`精确匹配到加群关键词${msg},正在邀请用户进群`)
        if (await room.has(contact)) {
          return [{ type: 1, content: `您已经加入【${msg}】！`, url: '' }]
        }
        let replys = [{ type: 1, content: `检索群【${msg}】成功，欢迎加入！`, url: '' }]
        let roomName = await room.topic()
        await addRoom(that, contact, roomName, replys)
      } else {
        return [{ type: 1, content: `检索群【${msg}】失败，请重新输入！`, url: '' }]
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
  msg = msg.trim()
  let eventName, args;
  if (msg.indexOf(" ") !== -1) {
    [ eventName, ...args]= msg.split(" ")
  } else {
    eventName = msg
    args = null
  }
  for (let item of config.eventKeywords) {
      if (eventName === item.keyword) {
        let res = await dispatch.dispatchEventContent(that, item.event, args, name, id, avatar, room)
        return res
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
      if (item.keyword == msg) {
        console.log(`精确匹配到关键词${msg},正在回复用户`)
        return msgArr(1, item.reply) 
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
