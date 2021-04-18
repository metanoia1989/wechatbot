const express = require('express')
const Bot = require('./bot')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const app_port = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 4545

app.get('/', async (req, res, next) => {
    try {
        const roomList = await Bot.getInstance().Room.findAll()
        res.send(JSON.stringify(roomList));
    } catch (error) {
        return next(error)
    }
});

function start_app_server() {
    app.listen(app_port, () => {
        console.info(`Listening on http://localhost:${app_port}`)
    });
}

module.exports = start_app_server