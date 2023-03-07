import Qrterminal from "qrcode-terminal";
import memoryCache from "../util/memoryCache.js";
import { log, ScanStatus } from "wechaty";
const { set } = memoryCache;
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
        ].join('');
        console.log(qrcodeImageUrl);
        set("qrcode", qrcode);
        log.info("TestBot", `onScan: ${ScanStatus[status]}(${status}) - ${qrcodeImageUrl}`);
        Qrterminal.generate(qrcode, { small: true }); // show qrcode on console
    }
    else {
        log.info("TestBot", `onScan: ${ScanStatus[status]}(${status})`);
    }
}
export default onScan;
