const express = require('express')
const router = express.Router()
const msgController = require('../controllers/message')

router.post('/sendMsgToRoom', msgController.validate.sendMsgToRoom,  msgController.sendMsgToRoom)
router.post('/sendMsgToGroup', msgController.validate.sendMsgToGroup,  msgController.sendMsgToGroup)

module.exports = router


