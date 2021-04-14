const { Wechaty, log } = require('wechaty');

var bot = new Wechaty({
  name: 'wechat-puppet-wechat', // generate xxxx.memory-card.json and save login data for the next login
});

//  二维码生成
function onScan(qrcode, status) {
  require('qrcode-terminal').generate(qrcode); // 在console端显示二维码
  const qrcodeImageUrl = [
    'https://wechaty.js.org/qrcode/',
    encodeURIComponent(qrcode),
  ].join('');
  console.log(qrcodeImageUrl);
}

// 登录
async function onLogin(user) {
  console.log(`小助手${user}登录了`);
  // 登陆后创建定时任务
  // 进入初始化操作，进入事件循环   
  // ...定时任务 后台定时的公告等等，一些功能可以参考付费的微管家    
  // 开启一个http服务，写一个相应的接口，发送个人消息、发送群体消息
  // 然后PHP那边来推送消息      
}

//登出
function onLogout(user) {
  log.info('小助手', '%s logout', user)
}

// 接收消息
async function onMessage(message) {
    log.info('小助手', message.toString())

    if (message.text() === 'ding') {
        await message.say('dong')
    }
}

bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);
bot.start()
  .then(() => log.info('开始登陆微信'))
  .catch((e) => log.error(e));
