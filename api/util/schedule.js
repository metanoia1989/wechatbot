const schedule = require('node-schedule')

/**
 * 设置定时器
 * @param {*} date 日期
 * @param {*} callback 回调
 */
//其他规则见 https://www.npmjs.com/package/node-schedule
// 规则参数讲解    *代表通配符
//
// *  *  *  *  *  *
// ┬ ┬ ┬ ┬ ┬ ┬
// │ │ │ │ │ |
// │ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
// │ │ │ │ └───── month (1 - 12)
// │ │ │ └────────── day of month (1 - 31)
// │ │ └─────────────── hour (0 - 23)
// │ └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

// 每分钟的第30秒触发： '30 * * * * *'
//
// 每小时的1分30秒触发 ：'30 1 * * * *'
//
// 每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'
//
// 每月的1日1点1分30秒触发 ：'30 1 1 1 * *'
//
// 每周1的1点1分30秒触发 ：'30 1 1 * * 1'

function setLocalSchedule(date, callback, name) {
  if (name) {
    schedule.scheduleJob(name, date, callback)
  } else {
    schedule.scheduleJob(date, callback)
  }
}

// 取消任务
function cancelLocalSchedule(name) {
  schedule.cancelJob(name)
}

// 取消指定任务
function cancelAllSchedule(type) {
  for (let i in schedule.scheduledJobs) {
    if (i.includes(type)) {
      cancelLocalSchedule(i)
    }
  }
}

/**
 * 获取所有定时任务的job名
 *
 */
function getAllSchedule() {
  for (let i in schedule.scheduledJobs) {
    console.log(i)
  }
}

/**
 * 设置提醒内容解析
 * @param {*} keywordArray 分词后内容
 * @param name
 */
function contentDistinguish(keywordArray, name) {
  let scheduleObj = {}
  let today = getToday()
  scheduleObj.setter = name // 设置定时任务的用户
  scheduleObj.subscribe = keywordArray[1] === '我' ? name : keywordArray[1] // 定时任务接收者
  if (keywordArray[2] === '每天') {
    // 判断是否属于循环任务
    console.log('已设置每日定时任务')
    scheduleObj.isLoop = true
    if (keywordArray[3].includes(':') || keywordArray[3].includes('：')) {
      let time = keywordArray[3].replace('：', ':')
      scheduleObj.time = convertTime(time)
    } else {
      scheduleObj.time = ''
    }
    scheduleObj.content = scheduleObj.setter === scheduleObj.subscribe ? `亲爱的${scheduleObj.subscribe}，温馨提醒：${keywordArray[4].replace('我', '你')}` : `亲爱的${scheduleObj.subscribe},${scheduleObj.setter}委托我提醒你，${keywordArray[4].replace('我', '你')}`
  } else if (keywordArray[2] && keywordArray[2].includes('-')) {
    console.log('已设置指定日期时间任务')
    scheduleObj.isLoop = false
    scheduleObj.time = keywordArray[2] + ' ' + keywordArray[3].replace('：', ':')
    scheduleObj.content = scheduleObj.setter === scheduleObj.subscribe ? `亲爱的${scheduleObj.subscribe}，温馨提醒：${keywordArray[4].replace('我', '你')}` : `亲爱的${scheduleObj.subscribe},${scheduleObj.setter}委托我提醒你，${keywordArray[4].replace('我', '你')}`
  } else {
    console.log('已设置当天任务')
    scheduleObj.isLoop = false
    scheduleObj.time = today + keywordArray[2].replace('：', ':')
    scheduleObj.content = scheduleObj.setter === scheduleObj.subscribe ? `亲爱的${scheduleObj.subscribe}，温馨提醒：${keywordArray[3].replace('我', '你')}` : `亲爱的${scheduleObj.subscribe},${scheduleObj.setter}委托我提醒你，${keywordArray[3].replace('我', '你')}`
  }
  return scheduleObj
}

module.exports = {
    setLocalSchedule,
    cancelLocalSchedule,
    cancelAllSchedule,
    getAllSchedule,
    contentDistinguish
}