const express = require('express')
const router = express.Router()
const keywordController = require('../controllers/keyword')
const auth = require('../util/auth')

router.get('/listKeyword', auth.required, 
    keywordController.validate.listKeyword, 
    keywordController.listKeyword)
router.get('/findKeyword', auth.required, 
    keywordController.validate.findKeyword, 
    keywordController.findKeyword)
router.post('/saveKeyword', auth.required, 
    keywordController.validate.saveKeyword, 
    keywordController.saveKeyword)
router.post('/updateKeyword', auth.required, 
    keywordController.validate.updateKeyword, 
    keywordController.updateKeyword)
router.post('/deleteKeyword', auth.required, 
    keywordController.validate.deleteKeyword, 
    keywordController.deleteKeyword)

module.exports = router