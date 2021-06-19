const express = require('express')
const router = express.Router()
const materialController = require('../controllers/material')
const auth = require('../util/auth')

router.get('/listMaterial', auth.required, 
    materialController.validate.listMaterial, 
    materialController.listMaterial)
router.get('/findMaterial', auth.required, 
    materialController.validate.findMaterial, 
    materialController.findMaterial)
router.post('/saveMaterial', auth.required, 
    materialController.validate.saveMaterial, 
    materialController.saveMaterial)
router.post('/updateMaterial', auth.required, 
    materialController.validate.updateMaterial, 
    materialController.updateMaterial)
router.post('/deleteMaterial', auth.required, 
    materialController.validate.deleteMaterial, 
    materialController.deleteMaterial)

module.exports = router