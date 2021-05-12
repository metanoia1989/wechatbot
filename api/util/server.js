//****************************************************** 
// 服务器工具类
//****************************************************** 
    
const Crypto = require('crypto')
const fs = require('fs')
const { avatar_dir, static_dir } = require('../config')
    
/**
 * 构造响应体
 * @param {mixed} data 
 * @param {integer} code 
 * @param {string} msg 
 * @returns 
 */
function res_data(data = null, code = 0, msg = "") {
    let res = { data, code, msg }
    return res
}

/**
 * 返回指定范围的随机整数
 * @param {*} min
 * @param {*} max
 */
function randomRange(min, max) {
  // min最小值，max最大值
  return Math.floor(Math.random() * (max - min)) + min
}

/**
 * 延时函数
 * @param {*} ms 毫秒
 */
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 读取文件
 */
const loadFile = {
  data: null,
  mtime: '',
  fetch(file) {
    try {
      let mtime = fs.statSync(file).mtime
      if (!this.data || mtime - this.mtime !== 0) {
        console.log('Reload task file: ' + mtime)
        this.data = JSON.parse(fs.readFileSync(file))
        this.mtime = +mtime
      }
    } catch (e) {
      console.log(e)
    }
    return this.data
  },
}


/**
 * 写入文件内容
 * @param fpath
 * @param encoding
 * @returns {Promise<unknown>}
 */
async function writeFile(fpath, encoding) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(fpath, encoding, function (err, content) {
      if (err) {
        reject(err)
      } else {
        resolve(content)
      }
    })
  })
}

/**
 * @return {string}
 */
function Base64Encode(str) {
  return Buffer.from(str).toString('base64')
}

/**
 * @return {string}
 */
function Base64Decode (str) {
  return Buffer.from(str, 'base64').toString('ascii')
}

/**
 * 数组拆分
 * @param {array} array 数组
 * @param {*} subGroupLength 每个数组长度
 */
function groupArray(array, subGroupLength) {
  let index = 0
  let newArray = []
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)))
  }
  return newArray
}


/**
 * 函数节流
 * @param fn
 * @param wait
 * @returns {Function}
 */
function throttle(fn, wait) {
  var timer = null
  return function () {
    var context = this
    var args = arguments
    if (!timer) {
      timer = setTimeout(function () {
        fn.apply(context, args)
        timer = null
      }, wait)
    }
  }
}

/**
 * 解析响应数据
 * @param {*} content 内容
 */
function parseBody(content) {
  if (!content) return
  return JSON.parse(content.text)
}

/**
 * MD5加密
 * @return {string}
 */
function MD5(str) {
  return Crypto.createHash('md5').update(str).digest('hex')
}

/**
 * 对象内容按照字母排序
 * @param obj
 */
function objKeySort(obj) {
  const newkey = Object.keys(obj).sort()
  const newObj = {}
  for (let i = 0; i < newkey.length; i++) {
    newObj[newkey[i]] = obj[newkey[i]]
  }
  return newObj
}

/**
 * 根据排序后的数据返回url参数
 * @param datas
 * @returns {string}
 */
function getQueryString(datas) {
  const data = objKeySort(datas)
  let url = ''
  if (typeof data === 'undefined' || data == null || typeof data !== 'object') {
    return ''
  }
  for (var k in data) {
    const string = typeof data[k] === 'object' ? JSON.stringify(data[k]) : data[k]
    url += (url.indexOf('=') !== -1 ? '&' : '') + k + '=' + string
  }
  return url
}

/**
 * 获取MD5加密后的Sign
 * @param secret
 * @param query
 * @returns {string}
 */
function getSign(secret, query) {
  const stringSignTemp = `${query}&ApiSecret=${secret}`
  return MD5(stringSignTemp).toUpperCase()
}

/**
 * 生成n位随机数
 * @param n
 * @returns {string}
 */
function rndNum(n) {
  let rnd = ''
  for (let i = 0; i < n; i++) {
    rnd += Math.floor(Math.random() * 10)
  }
  return rnd
}

/**
 * 生成加密后的对象
 * @param apiKey
 * @param apiSecret
 * @param params
 * @returns {{apiKey: *, nonce: *, timestamp: *}}
 */
function getFormatQuery(apiKey, apiSecret, params = {}) {
  const query = {
    apiKey: apiKey,
    timestamp: new Date().getTime(),
    nonce: rndNum(3),
    ...params,
  }
  const sign = getSign(getQueryString(query), apiSecret)
  query.sign = sign
  return query
}

/**
 * 下载用户头像
 * @param {Contact} user 
 */
async function downloadAvatar(contact) {
  // Save avatar to local file like `1-name.jpg`
  const file = await contact.avatar()
  const name = avatar_dir + file.name
  const path = `${static_dir}/${name}` 
  await file.toFile(name, true)  
  return path   
}

module.exports= {
    res_data,
    randomRange,
    loadFile,
    writeFile,
    Base64Encode,
    Base64Decode,
    groupArray,
    throttle,
    parseBody,
    rndNum,
    MD5,
    downloadAvatar,
}