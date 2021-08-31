const { DataTypes } = require('sequelize')
const { DB } = require('../util')
const db = new DB().getInstance()
const { Op } = require('sequelize');
const { Group, UserInfo } = require('./wavelib');
const { processWelcome } = require('../util/wechat');
const { WechatRoom, WechatKeyword } = require('./wechat-common')

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
  'unknown', 'personal', 'official'
]
UserInfo.hasOne(WechatContact, {
  foreignKey: 'uid',
})
WechatContact.belongsTo(UserInfo, {
  foreignKey: 'uid',
})

/**
 * 群组联系人关联表
 */
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

/**
 * 消息表
 */
const WechatMessage = db.define('WechatMessage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  msg_ident: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fromId: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  fromName: {
    type: DataTypes.STRING,
  },
  roomId: {
    type: DataTypes.STRING,
  },
  roomName: {
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
}, {
  tableName: 'wechat_message',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      name: 'msg_ident',
      unique: true,
      fields: ['msg_ident']
    }
  ],
});

/**
 * 群欢迎语
 */
const WechatRoomWelcome = db.define('WechatRoomWelcome', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  room_ident: {
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
}, {
  tableName: 'wechat_room_welcome',
  timestamps: false,
  indexes: [
    {
      name: 'room_ident',
      unique: true,
      fields: ['room_ident']
    }
  ],
});

WechatRoomWelcome.getWelcomeByIdent = async function (room_ident) {
  var item = await this.findOne({
    where: {
      room_ident: {
        [Op.in]: [room_ident, 'default@chatroom']
      },
      status: 1,
    },
    include: [
      { model: WechatRoom, },
      { model: WechatFile, as: 'link_img' },
      { model: WechatFile, as: 'img' },
    ],
    order: [
      ['id', 'DESC']
    ]
  })

  return processWelcome(item)
};
WechatRoomWelcome.getWelcomeByName = async function (group_name) {
  var item = await this.findOne({
    where: {
      status: 1,
    },
    include: [{
      model: WechatRoom,
      where: {
        name: {
          [Op.substring]: name,
        }
      }
    },
    { model: WechatFile, as: 'link_img' },
    { model: WechatFile, as: 'img' },
    ],
    order: [
      ['id', 'DESC']
    ]
  })
  return processWelcome(item)
};

WechatRoom.hasOne(WechatRoomWelcome, {
  foreignKey: 'room_ident',
  onDelete: 'CASCADE',
})
WechatRoomWelcome.belongsTo(WechatRoom, {
  foreignKey: 'room_ident',
  targetKey: 'room_ident',
})

Group.hasOne(WechatRoom, {
  foreignKey: 'groupid',
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
}, {
  tableName: 'wechat_file',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'md5_code',
      unique: true,
      fields: ['md5_code']
    }
  ],
});

WechatFile.getFileByMd5 = async function (md5_code) {
  var item = await this.findOne({
    where: { md5_code, }
  })
  return item
};

WechatRoomWelcome.belongsTo(WechatFile, {
  as: 'link_img',
  foreignKey: 'link_img_id',
})
WechatRoomWelcome.belongsTo(WechatFile, {
  as: 'img',
  foreignKey: 'img_id',
})


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


/**
 * 关键词回复表
 */
const WechatFriendWelcome = db.define('WechatFriendWelcome', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM,
    values: [0, 1],
    defaultValue: 1,
  },
  created_at: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'wechat_friend_welcome',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      name: 'name',
      unique: true,
      fields: ['name']
    }
  ],
})

module.exports = {
  WechatContact,
  WechatRoomContact,
  WechatMessage,
  WechatRoomWelcome,
  WechatFile,
  WechatMaterial,
  WechatFriendWelcome,
  WechatRoom,
}
