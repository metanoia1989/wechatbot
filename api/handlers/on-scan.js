const Qrterminal = require('qrcode-terminal');
const { set } = require('../util/memoryCache');
const { log, ScanStatus } = require('wechaty');
const Jimp = require("jimp")
const QrCode = require("qrcode-reader")

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

async function onSimplePadScan(qrcode, status) {
  /**
   * 由于服务端设计的不同,SimplePad和其他Puppet实现在获取二维码的数据上有所不同
   * 其他Puppet实现可能获取到的是"二维码解析"后的数据内容,SimplePad获取到的是一
   * 个二维码图片,所以需要先解析一次二维码,然后再把内容重新生成一个二维码输出到终端
   */
  if (status === ScanStatus.Waiting && qrcode) {
      const buffer = Buffer.from(qrcode, "base64")
      await Jimp.read(buffer, function (err, image) {
          if (err) {
              console.error("jimp err", err)
              return
          }
          const qr = new QrCode()
          qr.callback = function (err, result) {
              if (err) {
                  console.error("call back err", err)
                  return
              }
              Qrterminal.generate(result.result, { small: true })
              set("qrcode", result.result); 
          }
          qr.decode(image.bitmap)
      })
  } else {
      console.info("Bot Demo", `onScan: ${ScanStatus[status]}(${status})`)
  }
}
  
module.exports = onSimplePadScan
