import fs from "fs";
import pino from "pino";
import path from "path";
import { getToday } from "./datetime.js";
import config from "../config.js";
class Logger {
    constructor() {
        if (!Logger.instance) {
            const filename = path.join(config.__dirname, "..", `/logs/${getToday().trim()}.log`);
            if (!fs.existsSync(filename)) {
                fs.closeSync(fs.openSync(filename, 'w'));
            }
            Logger.instance = pino(pino.destination({
                dest: filename,
                minLength: 4096,
                sync: false // Asynchronous logging
            }));
        }
    }
    getInstance() {
        return Logger.instance;
    }
}
export default Logger;
