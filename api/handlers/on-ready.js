const common = require('../common/index')
const { delay } = require('../lib/index')

/**
 * 准备好的事件
 */
async function onReady() {
  console.log(`所有数据准备完毕`)
  await common.updateContactInfo(this)
  await delay(5000)
  await common.updateRoomInfo(this)
}

module.exports = onReady
