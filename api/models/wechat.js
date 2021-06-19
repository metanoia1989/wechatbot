const { DataTypes } = require('sequelize')
const { DB } = require('../util')
const db = new DB().getInstance()
const { Op } = require('sequelize');
const { Group, UserInfo } = require('./wavelib');
/**
 * 联系人表
 */
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
    weixin: {
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
    uid: {
        type: DataTypes.INTEGER, 
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
UserInfo.hasOne(WechatContact, {
    foreignKey: 'uid',
})
WechatContact.belongsTo(UserInfo, {
    foreignKey: 'uid',
})

/**
 * 微信群组表
 */
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
    groupid: {
        type: DataTypes.INTEGER, 
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

/**
 * 群组联系人关联表
 */
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

/**
 * 消息表
 */
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

/**
 * 群欢迎语
 */
const WechatRoomWelcome = db.define('WechatRoomWelcome', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },    
    group_ident: {
        type: DataTypes.STRING,
        allowNull: false,
    },   
    content: {
        type: DataTypes.TEXT,
    },   
    img_id: {
        type: DataTypes.INTEGER,
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
    link_img_id: {
        type: DataTypes.INTEGER,
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

WechatRoomWelcome.getWelcomeByIdent = async function(group_ident) {
  var item = await this.findOne({
      where: { 
        group_ident: {
          [Op.in]: [group_ident, 'default@chatroom']
        },
        status: 1, 
      },
      order: [
        ['id', 'DESC']
      ]
  })
  return item
};
WechatRoomWelcome.getWelcomeByName = async function(group_name) {
  var item = await this.findOne({
      where: { 
        status: 1, 
      },
      include: [{
          model: WechatRoom,
          where: {
            name: {
                [Op.substring]: group_name,
            }
          }
      }],
      order: [
        ['id', 'DESC']
      ]
  })
  return item
};

Group.hasOne(WechatRoom, {
    foreignKey: 'groupid',
})
WechatRoom.hasOne(WechatRoomWelcome, {
    foreignKey: 'group_ident',
    onDelete: 'CASCADE',
})
WechatRoomWelcome.belongsTo(WechatRoom, {
    foreignKey: 'group_ident',
})

WechatRoom.belongsTo(Group, {
    foreignKey: 'groupid',
})

/**
 * 文件表
 */
const WechatFile = db.define('WechatFile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },   
    file_name: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    file_type: {
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
    file_ext: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    md5_code: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    hash_code: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    driver: {
        type: DataTypes.ENUM, 
        values: ['local', 'qiniu', 'qcloud', 'alicloud'], 
        defaultValue: 'local',
    },
    thumb_img: {
        type: DataTypes.STRING, 
    },
    preview_img: {
        type: DataTypes.STRING, 
    },
    key: {
        type: DataTypes.STRING, 
    },
    file_size: {
        type: DataTypes.INTEGER, 
    },
    width: {
        type: DataTypes.INTEGER, 
    },
    height: {
        type: DataTypes.INTEGER, 
    },
    is_horizontal: {
        type: DataTypes.ENUM, 
        values: [0, 1], // 0 no 1 yes 
        defaultValue: 0,
    },
    thumb_size: {
        type: DataTypes.INTEGER, 
    },
    preview_size: {
        type: DataTypes.INTEGER, 
    },
    duration: {
        type: DataTypes.INTEGER, 
    },
    is_del: {
        type: DataTypes.ENUM, 
        values: [0, 1], // 0 no 1 yes 
        defaultValue: 0,
    },
    created_at: {
        type: DataTypes.DATE,
    },   
    updated_at: {
        type: DataTypes.DATE,
    },   
},{
    tableName: 'wechat_file',
    timestamps: true,
    indexes: [
        {
            name: 'md5_code',
            unique: true,
            fields: ['md5_code']
        }
    ],
});

/**
 * 文字素材表
 */
const WechatMaterial = db.define('WechatMaterial', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
    },
    content: {
        type: DataTypes.STRING,
    }
}, {
    tableName: 'wechat_material',
    timestamps: false,
    indexes: [
        {
            name: 'title',
            unique: true,
            fields: ['title']
        }
    ],
})


//******************************************************************* 
// 使用web协议的相关数据表 START 
//******************************************************************* 

/**
 * 微信群名称表
 * @deprecated 1.1
 */
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

/**
 * 微信群与微澜分馆关联表
 * @deprecated 1.1
 */
const WechatRoomToGroup = db.define('WechatRoomToGroup', {
    groupid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },   
    room_name_id: {
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


module.exports = {
    WechatContact,
    WechatRoom,
    WechatRoomContact,
    WechatMessage,
    WechatRoomWelcome,
    
    WechatFile,
    WechatMaterial,
}