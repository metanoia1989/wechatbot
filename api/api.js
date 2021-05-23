const Bot = require('./bot')
const express = require('express')
const cors = require('cors')
const errorhandler = require('errorhandler')

const { res_data } = require('./util/server')

const app_debug = process.env.APP_DEBUG ? true : false

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static(__dirname + '/public'));


app.use(require('./routes'))

app.get('/', async (req, res, next) => {
    try {
        const roomList = await Bot.getInstance().Room.findAll()
        res.send(JSON.stringify(roomList));
    } catch (error) {
        return next(error)
    }
});

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
if (app_debug) {
    // development error handler
    // will print stacktrace
    app.use(function (err, req, res, next) {
        console.log(err.stack);

        res.status(err.status || 500);
        res.json(res_data(err, -1, err.message))
    });
} else {
    app.use(errorhandler());
    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json(res_data(null, -1, err.message))
    });
}

function start_app_server() {
    const app_port = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 4545
    app.listen(app_port, () => {
        console.info(`Listening on http://localhost:${app_port}`)
    });
}

module.exports = start_app_server