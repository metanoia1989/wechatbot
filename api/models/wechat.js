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
    room_ident:{
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

// 群组和微信群关联表
const WechatToGroup = db.define('WechatToGroup', {
    groupid:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    room_ident: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'wechat_to_group',
    timestamps: false,
})
WechatToGroup.removeAttribute('id');


//******************************************************************* 
// 使用web协议的相关数据表 START 
//******************************************************************* 

// 微信群名称表
const WechatRoomNames = db.define('WecahtRoomNames', {
    room_name_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },   
    room_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },   
}, {
    tableName: 'wechat_room_names',
    timestamps: false,
    indexes: [
        {
            name: 'room_name',
            unique: true,
            fields: ['room_name']
        }
    ],
})
WechatRoomNames.removeAttribute('id');

const WechatRoomToGroup = db.define('WechatRoomToGroup', {
    groupid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },   
    groupid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },   
}, {
    tableName: 'wechat_room_to_group',
    timestamps: false,
    indexes: [
        {
            name: 'unique_ident',
            unique: true,
            fields: ['groupid', 'room_name_id']
        }
    ],
});
WechatRoomToGroup.removeAttribute('id');

WechatRoomNames.hasMany(WechatRoomToGroup, {
    foreignKey: 'room_name_id'
})
WechatRoomToGroup.belongsTo(WechatRoomNames)


//******************************************************************* 
// 使用web协议的相关数据表 End
//******************************************************************* 

// 群欢迎语
const WechatRoomWelcome = db.define('WechatRoomWelcome', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },   
    group_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },   
    content: {
        type: DataTypes.TEXT,
    },   
    img_url: {
        type: DataTypes.STRING,
    },   
    link_url: {
        type: DataTypes.STRING,
    },   
    link_title: {
        type: DataTypes.STRING,
    },   
    link_desc: {
        type: DataTypes.STRING,
    },   
    link_img: {
        type: DataTypes.STRING,
    },   
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
    },   
},{
    tableName: 'wechat_room_welcome',
    timestamps: false,
    indexes: [
        {
            name: 'group_name',
            unique: true,
            fields: ['group_name']
        }
    ],
});

module.exports = {
    WechatContact,
    WechatRoom,
    WechatRoomContact,
    WechatMessage,
    WechatToGroup,

    WechatRoomNames,
    WechatRoomToGroup,
    
    WechatRoomWelcome,
}