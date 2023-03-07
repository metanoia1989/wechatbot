import { Sequelize } from "sequelize";
import config from "../config.js";
class DB {
    constructor() {
        if (!DB.instance) {
            const { 
                DB_DATABASE: database, 
                DB_USERNAME: username, 
                DB_PASSWORD: password, 
                DB_TYPE: dialect, 
                DB_PREFIX: prefix, 
                DB_HOSTNAME: host, 
                DB_HOSTPORT: port, 
                DB_CHARSET: charset 
            } = config;

            DB.instance = new Sequelize(database, username, password, {
                host, dialect, port,
                define: {
                    schema: prefix,
                    schemaDelimiter: '_',
                    charset: charset,
                }
            });
        }
    }
    getInstance() {
        return DB.instance;
    }
}
export default DB;
