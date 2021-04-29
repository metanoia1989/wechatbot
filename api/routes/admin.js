const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin')

router.post('/login', adminController.validate.userLogin, adminController.login)

router.get('/me', (req, res) => {
    
})

module.exports = router