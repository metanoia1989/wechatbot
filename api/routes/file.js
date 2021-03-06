const express = require('express')
const router = express.Router()
const fileController = require('../controllers/file')
const auth = require('../util/auth')

router.get('/listFile', auth.required, 
    fileController.validate.listFile, 
    fileController.listFile)
router.get('/allFile', auth.required, 
    fileController.allFile)
router.get('/findFile', auth.required, 
    fileController.validate.findFile, 
    fileController.findFile)
router.post('/saveFile', auth.required, 
    fileController.validate.uploadFile, 
    fileController.validate.duplicateCheck, 
    fileController.saveFile)
router.post('/updateFile', auth.required, 
    fileController.validate.uploadFile, 
    fileController.validate.duplicateCheck, 
    fileController.updateFile)
router.post('/deleteFile', auth.required, 
    fileController.validate.deleteFile, 
    fileController.deleteFile)

module.exports = router