// 加载环境变量
require('dotenv').config({ path: __dirname+'/.env' })

// 加载日志类 数据库类
const { Logger, DB } = require('./util')
const logger = new Logger().getInstance()
const db = new DB().getInstance()

// 启动微信bot和express服务
const Bot = require('./bot')
const start_app_server = require('./api')

const restartProcess = () => {
    spawn(process.argv[1], process.argv.slice(2), {
      detached: true, 
      stdio: ['ignore', out, err]
    }).unref()
    process.exit()
}

// 处理未捕获的Promise异常，一般是wechaty库的原因
process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error);
    console.error("出现异常了，进行进程重启，后面需要单独写个进程来接收消息")
    restartProcess()
});

Bot.getInstance()
start_app_server()
