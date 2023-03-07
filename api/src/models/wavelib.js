import { DataTypes, Op } from "sequelize";
import { DB } from "../util/index.js";
const db = new DB().getInstance();
const Group = db.define('Group', {
    groupid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    groupname: {
        type: DataTypes.STRING,
    },
    libraryid: {
        type: DataTypes.INTEGER,
    },
    photo: {
        type: DataTypes.STRING,
    }
}, {
    tableName: 'group',
    timestamps: false,
});
Group.processPhoto = function (photo) {
    if (!photo) {
        return '';
    }
    return 'http://park.sanzhi.org.cn/uploadfile/group/' + photo;
};
/**
  * 微澜社区用户信息模型
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
});
UserInfo.processPhoto = function (photo) {
    if (!photo) {
        return '';
    }
    return 'http://park.sanzhi.org.cn/uploadfile/user/' + photo;
};
/**
  * 微澜社区用户模型
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
});
User.hasOne(UserInfo, {
    targetName: 'userid',
    foreignKey: 'userid',
});
UserInfo.belongsTo(User, {
    targetName: 'userid',
    foreignKey: 'userid'
});
export { Group };
export { User };
export { UserInfo };
export default {
    Group,
    User,
    UserInfo
};
