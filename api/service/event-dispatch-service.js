const { Group } = require('../models/wavelib')
const { WechatRoomWelcome } = require('../models/wechat')
const { formatDateWithoutTime, getToday } = require('../util/datetime')
const { generateChart } = require('../util/generateChart')
const { msgArr } = require('../util/lib')
const { LibDonateData, LibBorrowData, fetchRentingRecord } = require('../util/wavelib')

/**
 * 自定义事件列表，用于关键词回复
 */
const msgEventList = {
  "query-lib-donate": "馆募捐数据",
  "query-lib-borrow": "借阅数据" ,
  "set-group-welcome": "设置欢迎语" ,
  "reting-record-stats": "借阅统计" ,
  "the-day-all-rent-stats": "当日所有借阅统计" ,
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

    case "reting-record-stats": // "借阅统计" ,
      if (!args ||  args.length != 2) {
        content = "设置失败，参数格式必须为: 馆名 周期！"
        break;
      }
      if (!args[1]) {
        content = "查询失败，未指定周期！"
        break;
      }
      var today = new Date()
      let intervals = {
        '一周内': [new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),  today],
        '两周内':  [new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14),  today],
        '一个月内': [new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),  today],
        '两个月内': [new Date(today.getFullYear(), today.getMonth() - 2, today.getDate()),  today],
        '三个月内': [new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()),  today],
        '半年内':  [new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()),  today],
      }
      if (Object.keys(intervals).indexOf(args[1]) === -1) {
        let tips = Object.keys(intervals).join('、')
        content = `查询失败，无效的周期，周期必须为: ${tips}`
        break;
      }
      var interval = intervals[args[1]].map(item => formatDateWithoutTime(item))
      let group = await Group.findOne({ where: { groupname: args[0] } })
      if (group.libraryid == 0) {
        content = "此分馆没有益迪分馆ID！"
        break;
      }
      try {
        var data = await fetchRentingRecord(group.libraryid, ...interval)
        if (!data) {
          content = `${args[0]}暂无借阅统计`
          break;
        }
        url = await generateChart(args[0], data)
        content = `${args[0]}借阅统计如下`
      } catch (error) {
        content = `查询失败${error.toString()}`
        break;
      }
      type = 3
      break
    case "the-day-all-rent-stats": // "当日所有分馆借阅数据",
      try {
        var data = await fetchTheDayAllRentingRecord()
        if (!data) {
          content = `当日暂无借阅统计`
          break;
        }
        let name = `${getToday()}当日借阅统计`;
        url = await generateChart(name, data)
        content = `当日借阅统计如下`
      } catch (error) {
        content = `查询失败${error.toString()}`
        break;
      }
      type = 3
      break

      break
    case "fetch-room-invite": // "获取微澜群组邀请",
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
