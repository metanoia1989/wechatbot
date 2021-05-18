const { DataTypes } = require('sequelize')
const { DB } = require('../util')
const db = new DB().getInstance()

const WechatContact = db.define('WechatContact', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },   
    contact_ident: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    weixin: {
        type: DataTypes.STRING,
    },
    self: {
        type: DataTypes.INTEGER, 
        defaultValue: 0,
    },
    friend: {
        type: DataTypes.ENUM, 
        values: [0, 1, 2], // 0 no 1 yes 2 unknown
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
        values: [0, 1, 2], // 0 no 1 yes 2 unknown
        defaultValue: 2,
    },
    star: {
        type: DataTypes.INTEGER, 
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
        // values: ['unknown', 'personal', 'official'],
        values: [0, 1, 2],
        defaultValue: 2,
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

WechatContact.prototype.types = [
    'unknown','personal','official'
]

const WechatRoom = db.define('WechatRoom', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
        type: DataTypes.INTEGER, 
        defaultValue: 0,
    },
    manage: {
        type: DataTypes.INTEGER, 
        defaultValue: 0,
    },
}, {
    tableName: 'wechat_room',
    timestamps: false,
    indexes: [
        {
            name: 'room_ident',
            unique: true,
            fields: ['room_ident']
        }
    ],
})

const WechatRoomContact = db.define('WechatRoomContact', {
    room_ident: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contact_ident: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'wechat_room_contact',
    timestamps: false,
})
WechatRoomContact.removeAttribute('id');

const WechatMessage = db.define('WechatMessage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },   
    room_ident: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    filename: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    fromId: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    roomId: {
        type: DataTypes.STRING,
    },
    toId: {
        type: DataTypes.STRING,
    },
    content: {
        type: DataTypes.TEXT,
    },
    type: {
        type: DataTypes.INTEGER,
    },
    created_at: {
        type: DataTypes.DATE,
    },
})

module.exports = {
    WechatContact,
    WechatRoom,
    WechatRoomContact,
    WechatMessage
}