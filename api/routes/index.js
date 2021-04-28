const router = require('express').Router();

router.use('/admin', require('./admin'));

module.exports = router;