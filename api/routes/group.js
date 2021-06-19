const express = require('express')
const router = express.Router()
const groupController = require('../controllers/group')
const auth = require('../util/auth')

router.get('/listWelcome', auth.required, 
    groupController.validate.listWelcome, 
    groupController.listWelcome)
router.get('/findWelcome', auth.required, 
    groupController.validate.findWelcome, 
    groupController.findWelcome)
router.post('/saveWelcome', auth.required, 
    groupController.validate.saveWelcome, 
    groupController.saveWelcome)
router.post('/updateWelcome', auth.required, 
    groupController.validate.updateWelcome, 
    groupController.updateWelcome)
router.post('/deleteWelcome', auth.required, 
    groupController.validate.deleteWelcome, 
    groupController.deleteWelcome)

router.get('/listRoom', auth.required, 
    groupController.validate.listRoom, 
    groupController.listRoom)
router.post('/syncRoom', auth.required, 
    groupController.syncRoom)

router.get('/listLibrary', auth.required, 
    groupController.listLibrary)
router.post('/relateRoomLibrary', auth.required, 
    groupController.validate.relateRoomLibrary, 
    groupController.relateRoomLibrary)

module.exports = router