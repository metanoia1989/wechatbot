const router = require('express').Router();

router.use('/admin', require('./admin'));
router.use('/wechat', require('./wechat'));

module.exports = router;