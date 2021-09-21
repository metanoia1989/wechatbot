//**********************************************************
// 这里调用微澜图书馆的相关API
//**********************************************************

const axios = require('axios')
const { Group } = require("../models/wavelib")
const { getToday } = require('./datetime');
const { redisClient } = require('./redis');
const YDURL = 'https://yidivip.com/api/v2';

/**
 * 获取联劝网月捐数据
 * @param {string} groupName 分馆名称
 */
async function LibDonateData(groupname) {
    let group = await Group.findOne({ where: { groupname } })
    if (!group) {
        return null
    }
    let url = `http://park.sanzhi.org.cn/index.php?app=donate&ac=api&api=index&groupid=${group.groupid}`
    let res = await axios.get(url)
    if (res.data.status != 1) {
        return res.data.msg
    }
    let data = res.data.data
    let now = getToday()
    return `${groupname}${now}日募捐数据
募捐总额：💴${data.fundraising_total}
单次捐赠金额：💴${data.once_donation}
月捐金额：💴${data.monthly_donation}
捐赠人次：❤${data.person_time}❤
月捐人次：❤${data.monthly_donors_num}❤
最后更新时间：⏱${data.updated_at}⏱`
}

/**
 * 获取益迪云图借阅数据
 * @param {string} groupName 分馆名称
 */
async function LibBorrowData(groupname) {
    let group = await Group.findOne({ where: { groupname } })
    if (!group) {
        return null
    }
    let url = `http://park.sanzhi.org.cn/index.php?app=yidi&ac=api&api=index&libraryid=${group.libraryid}`
    let res = await axios.get(url)
    if (res.data.status != 1) {
        return res.data.msg
    }
    let data = res.data.data
    let now = getToday()
    return `${groupname}${now}日借阅数据
今日借出：${data.newRentCount}
今日归还：${data.newReturnCount}
今日新增读者：${data.newReaderCount}
今日新增图书：${data.newBookCount}
当前借出总数：${data.outLibBookCount}
读者总数：${data.readerCount}
图书总数：${data.bookCount}`
}

/**
 * 获取益迪云图登陆token
 *
 * @returns string
 */
async function fetchYidiToken() {
  let key = 'yidi_data:yidi_token'
  let token = await redisClient.get(key)
  if (token) {
    return token
  }

  let url = `${YDURL}/account/login/admin`
  let res = await axios.post(url, {
      username: process.env.YIDI_USERNAME,
      password: process.env.YIDI_PASSWORD,
  })
  token = res.data.data.token
  await redisClient.set(key, token, 'ex', 1500)
  return token
}

/**
 * 获取分馆的益迪借阅数据
 *
 * @param {integer} libraryid 益迪分馆ID
 * @param {string} start 开始日期 如 2021/8/1
 * @param {string} end 结束日期 如 2021/9/1
 * @returns
 */
async function fetchRentingRecord(libraryid, start, end) {
  let key = `yidi_data:reting_record_${libraryid}_${start}_${end}`
  let data = await redisClient.get(key)
  if (data) {
    return JSON.parse(data)
  }
  let url = `${YDURL}/statics/rentingrecord_range?unit=day&libraryid=${libraryid}`
    + `&start=${start}&end=${end}`
  let token = await fetchYidiToken()
  let res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  data = res.data.rentTrend
  if (data) {
    await redisClient.set(key, JSON.stringify(data))
  }
  return data
}

module.exports = {
    LibDonateData,
    LibBorrowData,
    fetchRentingRecord,
}

