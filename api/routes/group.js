const express = require('express')
const router = express.Router()
const groupController = require('../controllers/group')
const auth = require('../util/auth')

router.get('/listWelcome', auth.required, 
    groupController.validate.listWelcome, 
    groupController.listWelcome)
router.post('/saveWelcome', auth.required, 
    groupController.validate.saveWelcome, 
    groupController.saveWelcome)
router.post('/updateWelcome', auth.required, 
    groupController.validate.updateWelcome, 
    groupController.updateWelcome)
router.post('/deleteWelcome', auth.required, 
    groupController.validate.deleteWelcome, 
    groupController.deleteWelcome)

module.exports = router