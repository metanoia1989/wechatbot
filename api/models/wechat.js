const { DataTypes } = require('sequelize')
const { DB } = require('../util')
const db = new DB().getInstance()

const WechatContact = db.define('WechatContact', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },   
    contact_ident: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    weixin: {
        type: DataTypes.STRING,
    },
    self: {
        type: DataTypes.BOOLEAN, 
        defaultValue: 0,
    },
    friend: {
        type: DataTypes.ENUM, 
        value: [0, 1, 2], // 0 no 1 yes 2 unknown
        defaultValue: 2,
    },
    name: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    signature: {
        type: DataTypes.STRING,
    },
    alias: {
        type: DataTypes.STRING,
    },
    gender: {
        type: DataTypes.ENUM, 
        value: [0, 1, 2], // 0 no 1 yes 2 unknown
        defaultValue: 2,
    },
    star: {
        type: DataTypes.BOOLEAN, 
        defaultValue: 0,
    },
    province: {
        type: DataTypes.STRING, 
    },
    city: {
        type: DataTypes.STRING, 
    },
    avatar: {
        type: DataTypes.STRING, 
    },
    type: {
        type: DataTypes.ENUM, 
        value: ['unknown', 'personal', 'official'],
        defaultValue: 'unknown',
    },
}, {
    tableName: 'wechat_contact',
    timestamps: false,
    indexes: [
        {
            name: 'contact_ident',
            unique: true,
            fields: ['contact_ident']
        }
    ],
})

const WechatRoom = db.define('WechatContact', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },   
    room_ident: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    owner: {
        type: DataTypes.BOOLEAN, 
        defaultValue: 0,
    },
    manage: {
        type: DataTypes.BOOLEAN, 
        defaultValue: 0,
    },
}, {
    tableName: 'wechat_contact',
    timestamps: false,
    indexes: [
        {
            name: 'room_ident',
            unique: true,
            fields: ['room_ident']
        }
    ],
})

module.exports = {
    WechatContact,
    WechatRoom,

}