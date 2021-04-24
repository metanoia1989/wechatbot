// 加载环境变量
require('custom-env').env()

// 启动微信bot和express服务
const Bot = require('./bot')
const start_app_server = require('./api')

Bot.getInstance()
start_app_server()
