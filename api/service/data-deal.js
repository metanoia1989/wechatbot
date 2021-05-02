//*********************************************************** 
// 与数据库交互，同步微信数据，更新消息等 
// 需要改造为对数据库的操作 
//*********************************************************** 

/**
 * 获取定时提醒任务列表
 */
async function getScheduleList() {
  try {
    let option = {
      method: 'GET',
      url: '/task',
      params: {},
    }
    let res = await aiBotReq(option)
    let text = parseBody(res)
    let scheduleList = text.data
    console.log('获取定时任务成功:' + scheduleList)
    return scheduleList
  } catch (error) {
    console.log('获取定时任务失败:' + error)
  }
}

/**
 * 设置定时提醒任务
 * @param {*} obj 任务详情
 * @returns {*} 任务详情
 */
async function setSchedule(obj) {
  try {
    let option = {
      method: 'POST',
      url: '/task',
      params: obj,
    }
    let res = await aiBotReq(option)
    let content = parseBody(res)
    return content.data
  } catch (error) {
    console.log('添加定时任务失败', error)
  }
}

/**
 * 更新定时提醒任务
 */
async function updateSchedule(id) {
  try {
    let option = {
      method: 'GET',
      url: '/task/update',
      params: { id: id },
    }
    let res = await aiBotReq(option)
    console.log('更新定时任务成功')
  } catch (error) {
    console.log('更新定时任务失败', error)
  }
}


/**
 * 登录二维码推送
 * @param url
 * @param status
 * @returns {Promise<void>}
 */
async function setQrCode(url, status) {
  try {
    let option = {
      method: 'GET',
      url: '/wechat/qrcode',
      params: { qrUrl: url, qrStatus: status },
    }
    let res = await aiBotReq(option)
    if (res) {
      console.log('推送二维码成功')
    } else {
      console.log('推送登录二维码失败')
    }
  } catch (error) {
    console.log('推送登录二维码失败', error)
  }
}

/**
 * 推送登录状态的心跳
 * @param heart
 * @returns {Promise<void>}
 */
async function sendHeartBeat(heart) {
  try {
    let option = {
      method: 'GET',
      url: '/wechat/heart',
      params: { heartBeat: heart },
    }
    let res = await aiBotReq(option)
    console.log('推送心跳成功')
  } catch (error) {
    console.log('推送心跳失败', error)
  }
}

/**
 * 推送错误
 * @param error
 * @returns {Promise<void>}
 */
async function sendError(error) {
  try {
    let option = {
      method: 'GET',
      url: '/wechat/qrerror',
      params: { qrError: error },
    }
    let res = await aiBotReq(option)
    console.log('推送错误成功', error)
  } catch (e) {
    console.log('推送错误失败', e)
  }
}

/**
 * 更新头像
 * @returns {Promise<void>}
 * @param url
 * @param info 用户基本信息
 */
async function sendRobotInfo(url, name, id) {
  try {
    let option = {
      method: 'POST',
      url: '/wechat/info',
      params: { avatar: url, robotName: name, robotId: id },
    }
    let res = await aiBotReq(option)
    console.log('推送头像成功')
  } catch (error) {
    console.log('推送头像失败', error)
  }
}

/**
 * 更新好友
 * @returns {Promise<void>}
 * @param url
 */
async function sendFriend(friend) {
  try {
    let option = {
      method: 'POST',
      url: '/wechat/friend',
      params: { friend: friend },
    }
    let res = await aiBotReq(option)
    let content = parseBody(res)
    if (!content.code === 200) {
      console.log('推送失败', content.msg)
    }
  } catch (error) {
    console.log('推送好友列表失败')
  }
}

/**
 * 更新群
 * @returns {Promise<void>}
 * @param url
 */
async function sendRoom(room) {
  try {
    let option = {
      method: 'POST',
      url: '/wechat/room',
      params: { room: room },
    }
    let res = await aiBotReq(option)
    let content = parseBody(res)
    if (!content.code === 200) {
      console.log('推送失败', content.msg)
    }
  } catch (error) {
    console.log('推送群列表失败', error)
  }
}
/**
 * 同步群和好友列表
 */
async function asyncData(robotId, type) {
  try {
    let option = {
      method: 'get',
      url: '/wechat/asyncData',
      params: { type, robotId },
    }
    let res = await aiBotReq(option)
  } catch (error) {
    console.log('同步好友列表失败', error)
  }
}

module.exports = {
  getScheduleList,
  setSchedule,
  updateSchedule,
  setQrCode,
  sendHeartBeat,
  sendError,
  sendRobotInfo,
  sendFriend,
  sendRoom,
  asyncData,
}
