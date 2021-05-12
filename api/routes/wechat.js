const express = require('express')
const router = express.Router()
const wechatController = require('../controllers/wechat')

router.get('/self', wechatController.self)
router.get('/contactList', wechatController.contactList)

module.exports = router

