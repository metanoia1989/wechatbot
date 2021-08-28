const express = require('express')
const router = express.Router()
const contactController = require('../controllers/contact')
const auth = require('../util/auth')


router.get('/listContact', auth.required,
    contactController.validate.listContact,
    contactController.listContact)
router.post('/syncContact', auth.required,
    contactController.syncContact)

router.get('/findWelcome', auth.required,
    contactController.validate.findWelcome,
    contactController.findWelcome)
router.post('/updateWelcome', auth.required,
    contactController.validate.updateWelcome,
    contactController.updateWelcome)

module.exports = router
