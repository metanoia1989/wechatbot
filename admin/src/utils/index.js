/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}


/** 获取最大 z-index 的值 */
import {
  PopupManager
} from 'element-ui/lib/utils/popup'
export function getMaxIndex() {
  return PopupManager.nextZIndex()
}


export function color_log(...msg) {
  console.log('%c 🌹 调试信息 🦄',  'font-size:20px;background-color: #EA7E5C;color:#fff;', ...msg);
}

/**
* Format bytes as human-readable text.
* 
* @param bytes Number of bytes.
* @param si True to use metric (SI) units, aka powers of 1000. False to use 
*           binary (IEC), aka powers of 1024.
* @param dp Number of decimal places to display.
* 
* @return Formatted string.
*/
export function humanFileSize(bytes, si=false, dp=1) {
 const thresh = si ? 1000 : 1024;

 if (Math.abs(bytes) < thresh) {
   return bytes + ' B';
 }

 const units = si 
   ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
   : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
 let u = -1;
 const r = 10**dp;

 do {
   bytes /= thresh;
   ++u;
 } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

 return bytes.toFixed(dp) + ' ' + units[u];
}

/**
 * 图片转base64
 * @param {File} file 
 */
export function toBase64 (file ) {
  new Promise((resolve, reject) => {
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })
} 

/**
 * 是否是图片类型 
 * @param {string} mime 
 * @returns boolean
 */
export function isImageMime(mime) {
  let mimes = {
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'psd': 'image/photoshop'
  } 
  return Object.values(mimes).indexOf(mime) !== -1
}

/** 获取file大小的名称 */
export function fileSize(size) {
  var size_int = size
  if (typeof size === 'string' && size.constructor == String) {
    size_int = parseInt(size)
  }
  var formatSize
  if (parseInt(size_int / 1024 / 1024) > 0) {
    formatSize = (size_int / 1024 / 1024).toFixed(2) + 'MB'
  } else if (parseInt(size_int / 1024) > 0) {
    formatSize = (size_int / 1024).toFixed(2) + 'kB'
  } else {
    formatSize = size_int + 'Byte'
  }
  return formatSize
}

/** 深拷贝 */
export function objDeepCopy(source) {
  if (typeof source === 'object') {
    var sourceCopy = source instanceof Array ? [] : {}
    for (var item in source) {
      if (!source[item]) {
        sourceCopy[item] = source[item]
      } else {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item]
      }
    }
    return sourceCopy
  }
  return source
}

export function getDateFromTimestamp(time) {
  time = time ? time.toString() : ''
  let times = 0
  if (time.length === 13) {
    times = parseInt(time)
  } else if (time.length === 10) {
    times = parseInt(time) * 1000
  } else {
    return null
  }
  return new Date(times) // 如果date为13位不需要乘1000
}
