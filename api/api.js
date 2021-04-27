const Bot = require('./bot')
const express = require('express')
const expressValidator = require('express-validator')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const prefix = '/api/'
const admin = require('./routes/admin')
const logger = require('./util/logger')

app.use(`${prefix}/admin`, admin)


app.get('/', async (req, res, next) => {
    logger.info("测试哈哈哈")
    try {
        const roomList = await Bot.getInstance().Room.findAll()
        res.send(JSON.stringify(roomList));
    } catch (error) {
        return next(error)
    }
});

function start_app_server() {
    const app_port = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 4545
    app.listen(app_port, () => {
        console.info(`Listening on http://localhost:${app_port}`)
    });
}

module.exports = start_app_server