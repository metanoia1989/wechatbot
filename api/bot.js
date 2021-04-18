const { Wechaty, log } = require('wechaty');


class Bot {

  constructor(name = 'wechat-puppet-wechat') {
    if (this.instance) {
      return this.instance
    }
    this.bot = new Wechaty({ name });
    this.bot.on('scan', this.onScan);
    this.bot.on('login', this.onLogin);
    this.bot.on('logout', this.onLogout);
    this.bot.on('message', this.onMessage);
    this.bot.start()
      .then(this.onStart)
      .catch((e) => log.error(e));
  }
  
  /**
   * 单例模式，保证实例化一次
   * @returns this
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new Bot()
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

  /**
   * 二维码生成
   * @param {*} qrcode 
   * @param {*} status 
   */
  onScan(qrcode, status) {
    require('qrcode-terminal').generate(qrcode); // 在console端显示二维码
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('');
    console.log(qrcodeImageUrl);
  }

  // 登录
  onLogin(user) {
    console.log(`小助手${user}登录了`);
    // 登陆后创建定时任务
    // 进入初始化操作，进入事件循环   
    // ...定时任务 后台定时的公告等等，一些功能可以参考付费的微管家    
    // 开启一个http服务，写一个相应的接口，发送个人消息、发送群体消息
    // 然后PHP那边来推送消息      
  }

  //登出
  onLogout(user) {
    log.info('小助手', '%s logout', user)
  }

  // 接收消息
  async onMessage(message) {
      log.info('小助手', message.toString())

      if (message.text() === 'ding') {
          await message.say('dong')
      }
  }

}



module.exports = Bot