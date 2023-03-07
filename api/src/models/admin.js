import jwt from "jsonwebtoken";
import { DataTypes, Op } from "sequelize";
import { DB } from "../util/index.js";
import { getToday } from "../util/datetime.js";
import memoryCache from "../util/memoryCache.js";
import config from "../config.js";

const secret = config.APP_SECRET;
const { set, get } = memoryCache;
const db = new DB().getInstance();
const WechatAdmin = db.define('WechatAdmin', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
    last_login_at: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'wechat_admin',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            name: 'username',
            unique: true,
            fields: ['username']
        }
    ],
});
WechatAdmin.prototype.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    console.log(secret);
    return jwt.sign({
        id: this.id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};
const WechatToken = db.define('WechatToken', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    uid: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'api',
    },
    token: {
        type: DataTypes.STRING,
    },
    created_at: {
        type: DataTypes.DATE,
    },
    expired_at: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'wechat_token',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            name: 'token',
            unique: true,
            fields: ['token']
        }
    ],
});
WechatToken.prototype.checkApiToken = async function (token) {
    let key = `api_${token}`;
    let status = get(key);
    if (status !== undefined) {
        return status;
    }
    var item = await this.findOne({
        where: {
            token,
            status: 1,
        },
    });
    status = item ? true : false;
    set(key, status);
    return status;
};
WechatToken.prototype.refreshApiToken = function (token, status) {
    set(`api_${token}`, status);
};
export { WechatAdmin };
export { WechatToken };
export default {
    WechatAdmin,
    WechatToken
};
