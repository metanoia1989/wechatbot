/**
 * 获取周几
 * @param {*} date 日期
 */
function getDay(date) {
    var date2 = new Date();
    var date1 = new Date(date);
    var iDays = parseInt(Math.abs(date2.getTime() - date1.getTime()) / 1000 / 60 / 60 / 24);
    return iDays;
}
/**
 * 格式化日期
 * @param {*} date
 * @returns 例：2019-9-10 13:13:04 星期一
 */
function formatDate(date, weekend = false) {
    var tempDate = date instanceof Date ? date : new Date(date);
    var year = tempDate.getFullYear();
    var month = tempDate.getMonth() + 1;
    var day = tempDate.getDate();
    var hour = tempDate.getHours();
    var min = tempDate.getMinutes();
    var second = tempDate.getSeconds();
    var week = tempDate.getDay();
    var str = '';
    if (week === 0) {
        str = '星期日';
    }
    else if (week === 1) {
        str = '星期一';
    }
    else if (week === 2) {
        str = '星期二';
    }
    else if (week === 3) {
        str = '星期三';
    }
    else if (week === 4) {
        str = '星期四';
    }
    else if (week === 5) {
        str = '星期五';
    }
    else if (week === 6) {
        str = '星期六';
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (min < 10) {
        min = '0' + min;
    }
    if (second < 10) {
        second = '0' + second;
    }
    let result = `${year}-${month}-${day} ${hour}:${min}:${second}`;
    if (weekend) {
        result = `${result} ${str}`;
    }
    return result;
}
/**
 * 格式化日期
 * @param {*} date
 * @returns 例：2019-9-10
 */
function formatDateWithoutTime(date, split = "/") {
    var tempDate = date instanceof Date ? date : new Date(date);
    var year = tempDate.getFullYear();
    var month = tempDate.getMonth() + 1;
    var day = tempDate.getDate();
    let result = [year, month, day].join(split);
    return result;
}
/**
 * 获取今天日期
 * @returns 2019-7-19
 */
function getToday(split = '-') {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
        month = `0${month}`;
    }
    return [year, month, day].join(split);
}
/**
 * 获取今天日期
 * @returns 2019-7-19
 */
function getTomorrow(split = '-') {
    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    return convertToDate(split);
}
function getAddOneDay(date, split = '-') {
    let day = new Date(date);
    let tomorrow = new Date();
    tomorrow.setDate(day.getDate() + 1);
    return convertToDate(tomorrow, split);
}
/**
 * 转换为日期
 * @param {*} date
 */
function convertToDate(d, split = '-') {
    const date = new Date(d);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
        month = `0${month}`;
    }
    return [year, month, day].join(split);
}
/**
 * 转换定时日期格式
 * @param {*} time
 * @returns 0 12 15 * * * 每天下午3点12分
 */
function convertTime(time) {
    let array = time.split(':');
    return '0 ' + array[1] + ' ' + array[0] + ' * * *';
}
//
/**
 * 判断日期时间格式是否正确
 * @param {*} str 日期
 * @returns {boolean}
 */
function isRealDate(str) {
    var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
    var r = str.match(reg);
    if (r == null)
        return false;
    r[2] = r[2] - 1;
    var d = new Date(r[1], r[2], r[3], r[4], r[5]);
    if (d.getFullYear() != r[1])
        return false;
    if (d.getMonth() != r[2])
        return false;
    if (d.getDate() != r[3])
        return false;
    if (d.getHours() != r[4])
        return false;
    if (d.getMinutes() != r[5])
        return false;
    return true;
}
/**
 * 时间戳格式化为日期
 * @param {*} date
 * @returns 例：2019-9-10 13:13:04
 */
function timestampToDate(date) {
    var tempDate = new Date(date);
    var year = tempDate.getFullYear();
    var month = tempDate.getMonth() + 1;
    var day = tempDate.getDate();
    var hour = tempDate.getHours();
    var min = tempDate.getMinutes();
    var second = tempDate.getSeconds();
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (min < 10) {
        min = '0' + min;
    }
    if (second < 10) {
        second = '0' + second;
    }
    return `${year}-${month}-${day} ${hour}:${min}:${second}`;
}
export { getDay };
export { formatDate };
export { formatDateWithoutTime };
export { getToday };
export { convertTime };
export { isRealDate };
export { timestampToDate };
export { getTomorrow };
export { getAddOneDay };
export default {
    getDay,
    formatDate,
    formatDateWithoutTime,
    getToday,
    convertTime,
    isRealDate,
    timestampToDate,
    getTomorrow,
    getAddOneDay
};
