// 加载环境变量
require('dotenv').config({ path: __dirname+'/.env' })

// 加载日志类 数据库类
const { Logger, DB } = require('./util')
const logger = new Logger().getInstance()
const db = new DB().getInstance()

// 启动微信bot和express服务
const Bot = require('./bot')
const start_app_server = require('./api')

Bot.getInstance()
start_app_server()
