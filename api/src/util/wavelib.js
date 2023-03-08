import axios from "axios";
import { Group } from "../models/wavelib.js";
import { getToday, getAddOneDay } from "./datetime.js";
import { redisClient } from "./redis.js";
import { Op } from "sequelize";
import config from "../config.js";
const YDURL = 'https://yuntu.yidivip.com/api';

//***************************
// 这个功能好像没啥人用，废弃   
//***************************

/**
 * 获取联劝网月捐数据
 * @param {string} groupName 分馆名称
 */
async function LibDonateData(groupname) {
    let group = await Group.findOne({ where: { groupname } });
    if (!group) {
        return null;
    }
    let url = `http://park.sanzhi.org.cn/index.php?app=donate&ac=api&api=index&groupid=${group.groupid}`;
    console.log(url)
    let res = await axios.get(url);
    if (res.data.status != 1) {
        return res.data.msg;
    }
    let data = res.data.data;
    let now = getToday();
    return `${groupname}${now}日募捐数据
募捐总额：💴${data.fundraising_total}
单次捐赠金额：💴${data.once_donation}
月捐金额：💴${data.monthly_donation}
捐赠人次：❤${data.person_time}❤
月捐人次：❤${data.monthly_donors_num}❤
最后更新时间：⏱${data.updated_at}⏱`;
}
/**
 * 获取益迪云图借阅数据
 * @param {string} groupName 分馆名称
 */
async function LibBorrowData(groupname) {
    let group = await Group.findOne({ where: { groupname } });
    if (!group) {
        return null;
    }
    let url = `http://park.sanzhi.org.cn/index.php?app=yidi&ac=api&api=index&libraryid=${group.libraryid}`;
    console.log(url)
    let res = await axios.get(url);
    if (res.data.status != 1) {
        return res.data.msg;
    }
    let data = res.data.data;
    let now = getToday();
    return `${groupname}${now}日借阅数据
今日借出：${data.newRentCount}
今日归还：${data.newReturnCount}
今日新增读者：${data.newReaderCount}
今日新增图书：${data.newBookCount}
当前借出总数：${data.outLibBookCount}
读者总数：${data.readerCount}
图书总数：${data.bookCount}`;
}
/**
 * 获取益迪云图登陆token
 *
 * @returns string
 */
export async function fetchYidiToken() {
    let key = 'yidi_data:yidi_token';
    let token = await redisClient.get(key);
    if (token) {
        return token;
    }
    let url = `${YDURL}/pub/login`;
    let res = await axios.post(url, {
        username: config.YIDI_USERNAME,
        password: config.YIDI_PASSWORD,
    });
    let tmp_token = res.data.data.token;
    let admin_id = res.data.data.admins[0].id;
    url = `${YDURL}/pub/login/admin`;
    res = await axios.post(url, {
        admin_id, token: tmp_token,
    });
    token = res.data.data.token;

    await redisClient.set(key, token, 'ex', 1500);
    return token;
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
    let key = `yidi_data:reting_record_${libraryid}_${start}_${end}`;
    let data = await redisClient.get(key);
    if (data) {
        return JSON.parse(data);
    }
    let url = `${YDURL}/statics/rentingrecord_range?unit=day&library_id=${libraryid}`
        + `&start=${start}&end=${end}`;
    let token = await fetchYidiToken();
    let res = await axios.get(url, {
        headers: {
            'X-Token': token,
        }
    });
    data = res.data.rentTrend;
    if (data) {
        await redisClient.set(key, JSON.stringify(data));
    }
    return data;
}
/**
 * 获取当天所有分馆的借阅数据
 *
 * @param {String} date
 * @returns Array
 */
async function fetchTheDayAllRentingRecord(date = null) {
    if (!date)
        date = getToday('/');
    let end = getAddOneDay(date, '/');
    let key = `yidi_data:the_day_${date}_rent_data`;
    let data = await redisClient.get(key);
    if (data) {
        return JSON.parse(data);
    }
    let groups = await Group.findAll({ where: {
            libraryid: { [Op.ne]: 0 }
        }
    });
    console.log("分馆数", groups.length);
    data = await Promise.all(groups.map(async ({ groupname, libraryid }) => {
        let url = `${YDURL}/statics/rentingrecord_range?unit=day&library_id=${libraryid}`
            + `&start=${date}&end=${end}`;
        console.log(`开始请求分馆${groupname}的数据`, url);
        let token = await fetchYidiToken();
        let res = await axios.get(url, {
            headers: {
                'X-Token': token,
            }
        });
        let rent = res.data.rentTrend;
        if (rent) {
            rent = rent.pop().num;
            console.log(`${groupname} 借阅数据为`, rent);
        }
        return { groupname, num: rent };
    }));
    data = data.filter(item => item.num != null);
    if (data && data.length > 0) {
        data.sort(function (a, b) {
            let [_1, a_name, a_num] = a.groupname.match(/(.*?)(\d+)/);
            let [_2, b_name, b_num] = b.groupname.match(/(.*?)(\d+)/);
            if (a_name == b_name) {
                return a_num < b_num;
            }
            return a_name.localeCompare(b_name, "zh");
        });
        await redisClient.set(key, JSON.stringify(data), 'ex', 3600);
    }
    return data;
}
export { LibDonateData };
export { LibBorrowData };
export { fetchRentingRecord };
export { fetchTheDayAllRentingRecord };
export default {
    LibDonateData,
    LibBorrowData,
    fetchRentingRecord,
    fetchTheDayAllRentingRecord
};
