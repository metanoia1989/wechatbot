import { WechatyBuilder, log } from "wechaty";
import { PuppetPadlocal } from "@666666/wechaty-puppet-padlocal";
import onScan from "./handlers/on-scan.js";
import onLogin from "./handlers/on-login.js";
import onLogout from "./handlers/on-logout.js";
import onMessage from "./handlers/on-message.js";
import onFriend from "./handlers/on-friend.js";
import onRoomjoin from "./handlers/on-roomjoin.js";
import onRoomleave from "./handlers/on-roomleave.js";
import onRoomtopic from "./handlers/on-roomtopic.js";
import config from "./config.js";

class Bot {
    constructor(name = 'wechat-bot') {
        if (this.instance) {
            return this.instance;
        }
        // Padlocal协议的 puppet
        const puppet = new PuppetPadlocal({
            token: config.PADLOCAL_TOKEN,
        });

        // const puppet = 'wechaty-puppet-service'
        this.bot = WechatyBuilder.build({
            puppet,
            // workpro 的配置option START
            // puppetOptions: {
            //     token: config.WORKPRO_TOKEN,
            //     tls: {
            //         disable: true,
            //     },
            // },
            // workpro 的配置option END
        });
        console.log('hello');
        this.bot.on('scan', onScan);
        this.bot.on('login', onLogin);
        this.bot.on('logout', onLogout);
        this.bot.on('message', onMessage);
        this.bot.on('friendship', onFriend);
        this.bot.on('room-join', onRoomjoin);
        this.bot.on('room-leave', onRoomleave);
        this.bot.on('room-topic', onRoomtopic);
        this.bot.start()
            .then(this.onStart)
            .catch((e) => {
                console.log('bot start error', e)
                log.error(e);
            });
    }
    /**
     * 单例模式，保证实例化一次
     * 代理模式，直接通过instance访问bot，bot未登录会报错
     * @returns this
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new Proxy(new Bot(), {
                get(target, prop, receiver) {
                    if (!(prop in target) && (prop in target.bot)) {
                        // 访问的是函数，需要重新绑定this
                        if (typeof target.bot[prop] === 'function') {
                            return new Proxy(target.bot[prop], {
                                apply(target, thisArg, args) {
                                    target.apply(thisArg.bot, args);
                                }
                            });
                        }
                        return target.bot[prop];
                        // // 不在Bot中的方法，则是向this.bot请求，检测 bot 是否登录
                        // if (target.bot.isLoggedIn) {
                        // } else {
                        //   throw new Error("小助手未登录，无法调用！")
                        // }
                    }
                    return target[prop];
                }
            });
        }
        return this.instance;
    }
    //*************************************
    // 以下是 bot 的事件监听函数
    //*************************************
    /**
     * 微信机器人启动
     */
    onStart() {
        console.log("开始启动机器人");
    }
    // 接收消息
    async onMessage(msg) {
        console.log("接收到了消息：", JSON.stringify(msg));
        const room = msg.room(); // 是否为群消息
        const msgSelf = msg.self(); // 是否自己发给自己的消息
        if (msgSelf) {
            console.log("收到自己的消息");
        }
        if (room) {
            console.log("收到群组的消息");
        }
        else {
            console.log("收到其他人的消息");
        }
    }
}
export default Bot;
