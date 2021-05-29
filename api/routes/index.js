const router = require('express').Router();

router.use('/admin', require('./admin'));
router.use('/wechat', require('./wechat'));
router.use('/message', require('./message'));
router.use('/group', require('./group'));

module.exports = router;