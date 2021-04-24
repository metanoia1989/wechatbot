const { body } = require('express-validator')

exports.validate = {
    createUser: [
        body('userName', 'userName does\'t exists').exists(),
        body('email', 'Invalid email').exists().isEmail(),
        body('phone').optional().isInt(),
        body('status').optional().isIn(['enabled', 'disabled'])
    ]
}