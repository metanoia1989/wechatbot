const { FileBox, UrlLink } = require('wechaty');
const { WechatKeyword } = require('../models/wechat-common');
const { pushJob } = require('../util/queue')

/**
 * 配置项 Mock
 */
async function allConfig() {
  var keywords = await WechatKeyword.findAll({
    where: { status: 1 }
  })

  var roomJoinKeywords = keywords
    .filter(item => item.type === 3)
    .map(item => ({ keyword: item.keyword}))
  var eventKeywords = keywords
    .filter(item => item.type === 2)
    .map(item => ({ keyword: item.keyword, event: item.event }))
  var replyKeywords = keywords
    .filter(item => item.type === 1)
    .map(item => ({ keyword: item.keyword, reply: item.reply}))

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
  } else if (msg.type === 4 && msg.url !== '') {
    // url 链接
    let obj = new UrlLink({
      url: msg.url,
      title: msg.content,
      thumbnailUrl: msg.thumbnailUrl ? msg.thumbnailUrl : 'https://images-1251976096.cos.ap-guangzhou.myqcloud.com/wavelib/logo.jpg',
      description: msg.description ? msg.description : '',
    })
    console.log('回复内容', obj)
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
  } else if (msg.type === 4 && msg.url !== '') {
    // url 链接
    let obj = new UrlLink({
      url: msg.url,
      title: msg.content,
      thumbnailUrl: msg.thumbnailUrl ? msg.thumbnailUrl : 'https://images-1251976096.cos.ap-guangzhou.myqcloud.com/wavelib/logo.jpg',
      description: msg.description ? msg.description : '',
    })
    console.log('回复内容', obj)
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
      await room.add(contact, true)
      console.log("有没有走")
      for (const item of replys) {
        contactSay(contact, item)
      }
    } catch (e) {
      console.error('加群报错', e)
      let msg = { type: 1, content: `加入失败：${e.toString()}`}
      contactSay(contact, msg)
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
