const { WechatRoomWelcome } = require('../models/wechat')
const { msgArr } = require('../util/lib')
const { LibDonateData, LibBorrowData } = require('../util/wavelib')

/**
 * 自定义事件列表，用于关键词回复
 */
const msgEventList = {
  "query-lib-donate": "查询分馆募捐数据",
  "query-lib-borrow": "查询借阅数据" ,
  "set-group-welcome": "设置群组欢迎语" ,
}

/**
 * 根据事件名称分配不同的api处理，并获取返回内容
 * @param {string} eName 事件名称
 * @param {mixed} args 参数
 * @param name
 * @param id
 * @param avatar
 * @returns {string} 内容
 */
async function dispatchEventContent(that, eName, args, name, id, avatar, room) {
  let content = '',
    type = 1,
    url = ''

  switch (eName) {
    case "query-lib-donate": // "查询分馆募捐数据",
      content = await LibDonateData(args[0])
      break
    case "query-lib-borrow": // "查询借阅数据" ,
      content = await LibBorrowData(args[0])
      break
    case "set-group-welcome": // "设置群组欢迎语" ,
        console.log(room.id, args)
      if (!room) {
        content = "此操作只允许在群组中使用！"
        break;
      }
      if (!args[0]) {
        content = "设置失败，欢迎语为空！"
        break;
      }
      await WechatRoomWelcome.upsert({
        content: args[0]
      }, {
        room_ident: room.id
      })
      content = "设置群欢迎语成功"
      break
    case "fetch-room-invite": // "获取微澜群组邀请",
    default:
      break
  }
  return msgArr(type, content, url)
}


module.exports = {
  dispatchEventContent,
  msgEventList,
}
