const { body, validationResult } = require('express-validator')
const { res_data } = require('../util/server')

exports.validate = {
    createUser: [
        body('userName', 'userName does\'t exists').exists(),
        body('email', 'Invalid email').exists().isEmail(),
        body('phone').optional().isInt(),
        body('status').optional().isIn(['enabled', 'disabled'])
    ],
    userLogin: [
        body('username').exists(),
        body('password').exists(),
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
}