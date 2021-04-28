const { DataTypes } = require('sequelize')
const { DB } = require('../util')
const db = new DB().getInstance()

const UserInfo = db.define('UserInfo', {
  userid: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'user_info'
})

module.exports = UserInfo