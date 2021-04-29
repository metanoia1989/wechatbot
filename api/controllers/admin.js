const { body, validationResult } = require('express-validator')
const { User, UserInfo } = require('../models/user')
const { res_data } = require('../util/server')

exports.validate = {
    userLogin: [
        body('username', '无效的邮箱！').exists().isEmail(),
        body('password', '必须填写密码').exists(),
    ],
}


/**
 * 用户登陆
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.login = function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.toString())) 
    }

    const { username, password } = req.body
    User.findOne({
        where: {
            email: username,
        },
        include: UserInfo
    }).then(res => {
        if (!res) {
            throw new Error("用户不存在！")
        }

        const { salt, pwd, UserInfo: userinfo } = res
        if (MD5(salt + String(password)) != password) {
            throw new Error("账号密码错误！")
        }
        if (!userinfo.isadmin) {
            throw new Error("非管理员无法登陆后台！")
        }
        userinfo.token = userinfo.generateJWT()
        return res.json(res_data(userinfo.toAuthJSON())) 
    }).catch(next)
}