const Qrterminal = require('qrcode-terminal');
const { set } = require('../util/memoryCache');
const { log, ScanStatus } = require('wechaty');
// const { throttle } = require('../util/server')
// const { setQrCode } = require('../proxy/aibotk')

/**
 * 扫描登录，显示二维码
 * @param {*} qrcode 
 * @param {*} status 
 */
async function onScan(qrcode, status) {
  if (status === ScanStatus.Waiting && qrcode) {
    const qrcodeImageUrl = [
        'https://wechaty.js.org/qrcode/',
        encodeURIComponent(qrcode),
    ].join('')
    console.log(qrcodeImageUrl);
    set("qrcode", qrcode); 

    log.info("TestBot", `onScan: ${ScanStatus[status]}(${status}) - ${qrcodeImageUrl}`);
    Qrterminal.generate(qrcode, { small: true })  // show qrcode on console
  } else {
      log.info("TestBot", `onScan: ${ScanStatus[status]}(${status})`);
  }
}

module.exports = onScan
