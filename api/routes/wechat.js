const express = require('express')
const router = express.Router()
const wechatController = require('../controllers/wechat')

router.get('/self', wechatController.self)
router.get('/contactList', wechatController.contactList)
router.get('/roomList', wechatController.roomList)
router.get('/roomOwner', wechatController.roomOwner)
router.get('/roomAnnounce', wechatController.roomAnnounce)
router.get('/roomMemberAll', wechatController.roomMemberAll)

module.exports = router

