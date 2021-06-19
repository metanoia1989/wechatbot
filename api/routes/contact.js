const express = require('express')
const router = express.Router()
const contactController = require('../controllers/contact')
const auth = require('../util/auth')


router.get('/listContact', auth.required, 
    contactController.validate.listContact, 
    contactController.listContact)
router.get('/syncContact', auth.required, 
    contactController.syncContact)

module.exports = router