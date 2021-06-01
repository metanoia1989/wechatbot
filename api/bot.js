const { Wechaty, log } = require('wechaty');
const { PuppetPadlocal } = require("wechaty-puppet-padlocal");

class Bot {

  constructor(name = 'wechat-puppet-wechat') {
    if (this.instance) {
      return this.instance
    }
    // const puppet = new PuppetPadlocal({
    //   token: process.env.PADLOCAL_TOKEN
    // })
    // this.bot = new Wechaty({ name,  puppet });
    this.bot = new Wechaty({ 
      name ,
      puppetOptions: {
        launchOptions: {
          args: ['--disable-dev-shm-usage']
        }
      }
    });
    this.bot.on('scan', require("./handlers/on-scan"));
    this.bot.on('login', require("./handlers/on-login"));
    this.bot.on('logout', require("./handlers/on-logout"));
    this.bot.on('message', require("./handlers/on-message"));
    this.bot.on('room-join', require("./handlers/on-roomjoin"));
    this.bot.on('room-leave', require("./handlers/on-roomleave"));
    this.bot.on('room-topic', require("./handlers/on-roomtopic"));
    this.bot.start()
      .then(this.onStart)
      .catch((e) => log.error(e));
  }
  
  /**
   * 单例模式，保证实例化一次
   * 代理模式，直接通过instance访问bot，bot未登录会报错  
   * @returns this
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new Proxy(new Bot(), {
        get (target, prop, receiver) {
          if (!(prop in target) && (prop in target.bot)) {
              // 访问的是函数，需要重新绑定this
              if (typeof target.bot[prop] === 'function') {
                return new Proxy(target.bot[prop], {
                  apply(target, thisArg, args) {
                    target.apply(thisArg.bot, args)
                  }
                })
              }
              return target.bot[prop]

            // // 不在Bot中的方法，则是向this.bot请求，检测 bot 是否登录
            // if (target.bot.logonoff()) {
            // } else {
            //   throw new Error("小助手未登录，无法调用！")
            // }
          } 
          return target[prop]
        }
      })
    }
    return this.instance
  }

  //*************************************
  // 以下是 bot 的事件监听函数
  //*************************************
  /**
   * 微信机器人启动
   */
  onStart() {
    console.log("开始启动机器人")
  }

  // 接收消息
  async onMessage(msg) {
      console.log("接收到了消息：", JSON.stringify(msg));

      const room = msg.room() // 是否为群消息
      const msgSelf = msg.self() // 是否自己发给自己的消息
      if (msgSelf) {
        console.log("收到自己的消息")
      }
      if (room) {
        console.log("收到群组的消息")
      } else {
        console.log("收到其他人的消息")
      }
  }

}



module.exports = Bot