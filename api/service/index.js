const { FileBox } = require('wechaty')
const { pushJob } = require('../util/queue')

/**
 * 配置项 Mock
 */
function allConfig() {
    var roomJoinKeywords = [];
    var eventKeywords = [];
    var replyKeywords = [];

    return {
        roomJoinKeywords,        
        eventKeywords,
        replyKeywords,
    };    
}

/**
 * 群关键词回复
 * @param {*} contact
 * @param {*} msg
 * @param {*} isRoom
 */
async function roomSay(room, contact, msg) {
  if (msg.type === 1 && msg.content !== '') {
    // 文字
    console.log('回复内容', msg.content)

    await pushJob(async () => {
      contact ? await room.say(msg.content, contact) : await room.say(msg.content)
    })
  } else if (msg.type === 2 && msg.url !== '') {
    // url文件
    let obj = FileBox.fromUrl(msg.url)
    console.log('回复内容', obj)
    contact ? await room.say('', contact) : ''
    await pushJob(async () => {
      await room.say(obj)
    })
  } else if (msg.type === 3 && msg.url !== '') {
    // bse64文件
    let obj = FileBox.fromDataURL(msg.url, 'room-avatar.jpg')
    contact ? await room.say('', contact) : ''
    await pushJob(async () => {
      await room.say(obj)
    })
  }
}

/**
 * 私聊发送消息
 * @param contact
 * @param msg
 * @param isRoom
 */
async function contactSay(contact, msg, isRoom = false) {
  if (msg.type === 1 && msg.content !== '') {
    // 文字
    console.log('回复内容', msg.content)
    await pushJob(async () => {
      await contact.say(msg.content)
    })
  } else if (msg.type === 2 && msg.url !== '') {
    // url文件
    let obj = FileBox.fromUrl(msg.url)
    console.log('回复内容', obj)
    if (isRoom) {
      await pushJob(async () => {
        await contact.say(`@${contact.name()}`)
      })
    }
    await pushJob(async () => {
      await contact.say(obj)
    })
  } else if (msg.type === 3 && msg.url !== '') {
    // bse64文件
    let obj = FileBox.fromDataURL(msg.url, 'user-avatar.jpg')
    await pushJob(async () => {
      await contact.say(obj)
    })
  }
}

/**
 * 统一邀请加群
 * @param that
 * @param contact
 */
async function addRoom(that, contact, roomName, replys) {
  let room = await that.Room.find({ topic: roomName })
  if (room) {
    try {
      for (const item of replys) {
        contactSay(contact, item)
      }
      await room.add(contact)
    } catch (e) {
      console.error('加群报错', e)
    }
  } else {
    console.log(`不存在此群：${roomName}`)
  }
}

module.exports = {
  addRoom,
  contactSay,
  roomSay,
  allConfig,
}
