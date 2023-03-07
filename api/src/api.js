import Bot from "./bot.js";
import express from "express";
import cors from "cors";
import errorhandler from "errorhandler";
import expressJSDocSwagger from "express-jsdoc-swagger";
import apiDocsOptions from "./util/api-docs.js";
import { res_data } from "./util/server.js";
import routes from "./routes/index.js";
import config from './config.js';

const app_debug = config.APP_DEBUG ? true : false;
const app = express();

// 生成API文档
expressJSDocSwagger(app)(apiDocsOptions);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(config.__dirname + '/public'));
app.use(routes);
app.get('/', async (req, res, next) => {
    try {
        const roomList = await Bot.getInstance().Room.findAll();
        res.send(JSON.stringify(roomList));
    }
    catch (error) {
        return next(error);
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
        res.json(res_data(err, -1, err.message));
    });
}
else {
    app.use(errorhandler());
    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json(res_data(null, -1, err.message));
    });
}
function start_app_server() {
    const app_port = config.APP_PORT ? parseInt(config.APP_PORT) : 4545;
    app.listen(app_port, () => {
        console.info(`Listening on http://localhost:${app_port}`);
    });
}
export default start_app_server;
