import { initAllSchedule } from "../util/task.js";
import memoryCache from "../util/memoryCache.js";
import { MD5, delay } from "../util/server.js";
import { initAllSyncData } from "../service/syncData.js";
const { set } = memoryCache;
/**
 * 登录成功监听事件
 * @param {*} user 登录用户
 */
async function onLogin(user) {
    console.log(`贴心助理${user}登录了`);
    // 登陆后创建定时任务
    // 进入初始化操作，进入事件循环   
    // ...定时任务 后台定时的公告等等，一些功能可以参考付费的微管家    
    // 开启一个http服务，写一个相应的接口，发送个人消息、发送群体消息
    // 然后PHP那边来推送消息      
    set("qrcodeSrc", "");
    const userInfo = {
        ...user.payload,
        robotId: user.payload.weixin || MD5(user.name()),
    };
    await delay(3000);
    // TODO 同步群组信息和联系人信息
    // await initAllSyncData(this);

    // await addUser(userInfo) // 全局存储登录用户信息
    // const file = await user.avatar()
    // const base = await file.toBase64()
    // const avatarUrl = await putqn(base, user.name())
    // await sendRobotInfo(avatarUrl, user.name(), userInfo.robotId) // 更新用户头像
    // await delay(6000)
    // await initAllSchedule(this) // 初始化任务
}
export default onLogin;
