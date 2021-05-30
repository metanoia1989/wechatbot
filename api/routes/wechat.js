const express = require('express')
const router = express.Router()
const wechatController = require('../controllers/wechat')
const auth = require('../util/auth')

router.get('/self', wechatController.self)
router.get('/contactList', wechatController.contactList)
router.get('/roomList', wechatController.roomList)
router.get('/roomFind', wechatController.roomFind)
router.get('/roomOwner', wechatController.roomOwner)
router.get('/roomAnnounce', wechatController.roomAnnounce)
router.get('/roomMemberAll', wechatController.roomMemberAll)

router.get('/loginStatus', auth.required, wechatController.loginStatus)
router.get('/qrcode', auth.required, wechatController.qrcode)

module.exports = router

