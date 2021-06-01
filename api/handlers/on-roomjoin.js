const { default: FileBox } = require('file-box');
const path = require('path');
const { UrlLink } = require('wechaty');
const { WechatRoomWelcome } = require('../models/wechat');
const { pushJob } = require('../util/queue');

/**
 * 群中有新人进入
 */
async function onRoomjoin(room, inviteeList, inviter, date) {
  const nameList = inviteeList.map((c) => c.name()).join(',')
  const roomName = await room.topic()
  var welcome = await WechatRoomWelcome.getWelcome(roomName)
  var content = welcome.content ? welcome.content.replace('{{username}}', nameList) : `欢迎${nameList}加入本群！` 
  room.say(content)
  pushJob(async () => {
    if (welcome.img_url) {
      const file = FileBox.fromUrl(welcome.img_url)
      room.say(file)
    }
    if (welcome.link_title && welcome.link_img && welcome.link_url) {
        const linkPayload = new UrlLink({
          title: welcome.link_title,
          description: welcome.link_desc || '',
          thumbnailUrl: welcome.link_img,
          url: welcome.link_url
        })
        room.say(linkPayload)
    }
  })
  console.log(`群名： ${roomName} ，加入新成员： ${nameList}, 邀请人： ${inviter}`)
}

module.exports = onRoomjoin
