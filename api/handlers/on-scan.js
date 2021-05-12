const Qrterminal = require('qrcode-terminal');
const { set } = require('../util/memoryCache');
// const { throttle } = require('../util/server')
// const { setQrCode } = require('../proxy/aibotk')

/**
 * 扫描登录，显示二维码
 * @param {*} qrcode 
 * @param {*} status 
 */
async function onScan(qrcode, status) {
  Qrterminal.generate(qrcode)
  console.log('扫描状态', status)
  // throttle(setQrCode(qrcode, status), 30000)
  const qrcodeImageUrl = [
    'https://wechaty.js.org/qrcode/',
    encodeURIComponent(qrcode),
  ].join('');
  console.log(qrcodeImageUrl);
  set("qrcodeSrc", qrcodeImageUrl); 
}

module.exports = onScan
