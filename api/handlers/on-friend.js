const { Friendship } = require('wechaty')
const Bot = require('../bot')
const { addContactToDb } = require('../service/syncData')
const { delay } = require('../util/server')

/**
 * 好友添加
 */
async function onFriend(friendship) {
  let logMsg, hello
  let config = {
    autoAcceptFriend: true
  }
  try {
    let name = friendship.contact().name()
    hello = friendship.hello()
    logMsg = name + '，发送了好友请求'
    console.log(logMsg)
    if (config.autoAcceptFriend) {
      switch (friendship.type()) {
        case Friendship.Type.Receive:
          // 3秒后添加好友
          await delay(3000)
          await friendship.accept()
          let contact = await Bot.getInstance().Contact.load(friendship.contact().id)
          addContactToDb(contact)
          break
        case Friendship.Type.Confirm:
          logMsg = '已确认添加好友：' + name
          console.log(logMsg)
          break
      }
    } else {
      console.log('未开启自动添加好友功能，忽略好友添加')
    }
  } catch (e) {
    logMsg = e
    console.log('添加好友出错：', logMsg)
  }
}

module.exports = onFriend
