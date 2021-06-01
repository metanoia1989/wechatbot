const path = require('path')
const { Op } = require('sequelize');

/**
 * 群中有新人进入
 */
async function onRoomjoin(room, inviteeList, inviter, date) {
  console.log("触发吗？")
  const nameList = inviteeList.map((c) => c.name()).join(',')
  const roomName = await room.topic()
  console.log('进群', roomName, roomIndex, nameList)
  var data = await WechatRoomWelcome.getWelcome(roomName)
  console.log(data)
  console.log(`群名： ${roomName} ，加入新成员： ${nameList}, 邀请人： ${inviter}`)
}

module.exports = onRoomjoin
