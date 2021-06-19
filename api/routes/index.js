const router = require('express').Router();

router.use('/admin', require('./admin'));
router.use('/wechat', require('./wechat'));
router.use('/message', require('./message'));
router.use('/group', require('./group'));
router.use('/contact', require('./contact'));
router.use('/material', require('./material'));
router.use('/file', require('./file'));

module.exports = router;