const { msgArr } = require('../util/lib')
const { updateContactAndRoom } = require('./index')

/**
 * 自定义事件列表，用于关键词回复
 */
const msgEventList = [
    { key: "query-lib-donate", title: "查询分馆募捐数据" },
    { key: "query-lib-borrow", title: "查询借阅数据" },
    { key: "fetch-room-invite", title: "获取微澜群组邀请" },
]


/**
 * 根据事件名称分配不同的api处理，并获取返回内容
 * @param {string} eName 事件名称
 * @param {string} msg 消息内容
 * @param name
 * @param id
 * @param avatar
 * @returns {string} 内容
 */
async function dispatchEventContent(that, eName, msg, name, id, avatar, room) {
  let content = '',
    type = 1,
    url = ''
  switch (eName) {
    case 'reloadFriend':
      await updateContactAndRoom(that)
      content = '更新好友群消息成功，请稍等两分钟后生效'
      break
    default:
      break
  }
  return msgArr(type, content, url)
}


module.exports = {
  dispatchEventContent,
  msgEventList,
}
