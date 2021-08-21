//********************************************************** 
// 这里调用微澜图书馆的相关API
//********************************************************** 

const axios = require('axios')
const { Group } = require("../models/wavelib")
const { getToday } = require('./datetime')

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
    let url = `http://park.sanzhi.org.cn/index.php?app=yidi&ac=api&api=index&libraryid=${group.groupid}`
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

module.exports = {
    LibDonateData,
    LibBorrowData,
}