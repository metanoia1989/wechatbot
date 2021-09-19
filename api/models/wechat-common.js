const { DB } = require('../util');
const db = new DB().getInstance()
const { DataTypes } = require('sequelize')

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
 * 关键词回复表
 */
const WechatKeyword = db.define('WechatKeyword', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  keyword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM,
    values: [1, 2, 3],
    defaultValue: 1,
  },
  reply: {
    type: DataTypes.STRING,
  },
  event: {
    type: DataTypes.STRING,
  },
  scope: {
    type: DataTypes.ENUM,
    values: ['all', 'group', 'personal'],
    defaultValue: 'all',
  },
  status: {
    type: DataTypes.ENUM,
    values: [0, 1],
    defaultValue: 1,
  },
  created_at: {
    type: DataTypes.DATE,
  },
  updated_at: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'wechat_keyword',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'title',
      unique: true,
      fields: ['title']
    }
  ],
})

module.exports = {
  WechatRoom,
  WechatKeyword,
}
