
const { DataTypes } = require('sequelize')
const { DB } = require('../util')
const db = new DB().getInstance()

/**
  * 微澜社区用户信息模型 
  * @deprecated 1.1.0 用全新的admin表替代
  */
const UserInfo = db.define('UserInfo', {
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
  },
  sex: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  idcard: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  face: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  about: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  isadmin: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  tableName: 'user_info',
  timestamps: false
})

UserInfo.prototype.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  console.log(secret)
  return jwt.sign({
    id: this.userid,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

UserInfo.prototype.toAuthJSON = function(){
  return {
    username: this.username,
    token: this.generateJWT(),
    image: this.face
  };
};



/**
  * 微澜社区用户模型 
  * @deprecated 1.1.0 用全新的admin表替代
  */
const User = db.define('User', {
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  pwd: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'user',
  timestamps: false,
})


User.hasOne(UserInfo, {
  targetName: 'userid',
  foreignKey: 'userid',
})
UserInfo.belongsTo(User, {
  targetName: 'userid',
  foreignKey: 'userid'
})

module.exports = {
  User,
  UserInfo
}