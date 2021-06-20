
const { body, validationResult, query } = require('express-validator')
const { res_data, fileMd5, detectiveTypeByFileMime, getImageSize } = require('../util/server');
const { Op } = require('sequelize');
const { WechatFile } = require('../models/wechat');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { getKeyUrl } = require('../util/wechat');

// 文件上传初始化参数
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const ext = (file.originalname).split('.').pop();
        const prefix = file.originalname.substring(0, file.originalname.length - ext.length - 1)
        const filename = prefix + '-' + Date.now() + "." + ext;
        cb(null, filename);
    }
});

const limits = {
    fileSize: 2 * 1024 * 1024,
};

const fileFilter = async (req, file, cb) => {
    const ext = (file.originalname).split('.').pop();
    const allowExt = ['jpg', 'jpeg', 'png', 'gif'];
    const allowMime = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowExt.indexOf(ext) === -1 || allowMime.indexOf(file.mimetype) === -1) {
        cb(null, false);
        return cb(new Error('文件类型错误'));
    }
    return cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits,
}).single('file');

exports.validate = {
    findFile: [
        query('id').exists().isInt().withMessage('ID必须为正整数！'),
    ],
    listFile: [
        query('id').optional({ nullable: true }).isInt().withMessage('ID必须为正整数！'),
        query('page').optional({ nullable: true }).isInt().withMessage('页数必须为正整数！'),
        query('limit').optional({ nullable: true }).isInt().withMessage('每页条数必须为正整数！'),
        query('keyword').optional({ nullable: true }).notEmpty(),
        query('file_type').optional({ nullable: true }).isInt(),
    ],
    deleteFile: [
        body('id', 'ID必须为整数！').exists().isInt(),
    ],
    uploadFile: upload,
    duplicateCheck: [
        body('file').custom(async (value, { req }) => {
            req.file.md5 = fileMd5(req.file.path)
            let oldFile = await WechatFile.getFileByMd5(req.file.md5)
            if (oldFile) {
                fs.access(req.file.path, fs.F_OK, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    fs.unlink(req.file.path, () => { })
                })
                return Promise.reject('文件已存在，请勿重复上传！')
            }
        })
    ]
}

/**
 * 文件列表
 *
 * @param {*} req 
 *            group_name 组名
 * @param {*} res 
 * @param {*} next 
 */
exports.listFile = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg))
    }

    let where = {}
    if (req.query.id) {
        where.id = req.query.id
    } else if (req.query.keyword) {
        where.file_name = {
            [Op.substring]: req.query.keyword
        }
    }

    if (req.query.file_type) {
        where.file_type = req.query.file_type 
    }

    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let offset = (page - 1) * limit;
        var items = await WechatFile.findAll({
            where, limit, offset,
            order: [
                ['id', 'DESC']
            ]
        })
        items = items.map(item => {
            item.key = getKeyUrl(item.key)
            return item
        })
        var total = await WechatFile.count({ where })
        var data = { items, total }
    } catch (error) {
        return res.json(res_data(null, -1, error.toString()))
    }
    return res.json(res_data(data))
}

/**
 * 所有文件列表
 *
 * @param {*} req 
 *            group_name 群组名
 * @param {*} res 
 * @param {*} next 
 */
exports.allFile = async (req, res, next) => {
    try {
        var items = await WechatFile.findAll()
        items = items.map(item => {
            item.key = getKeyUrl(item.key)
            return item
        })
    } catch (error) {
        return res.json(res_data(null, -1, error.toString())) 
    }
    return res.json(res_data(items))
}


/**
 *  文件详情
 *
 * @param {*} req 
 *            id 文件ID
 * @param {*} res 
 * @param {*} next 
 */
exports.findFile = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg))
    }

    try {
        var data = await WechatFile.findByPk(req.query.id)
        if (data) {
            data.key = getKeyUrl(data.key)
        }
    } catch (error) {
        return res.json(res_data(null, -1, error.toString()))
    }

    return res.json(res_data(data))
}


/**
 * 添加文件
 *
 * @param {*} req 
 *            title 组标识
 * @param {*} res 
 * @param {*} next 
 */
exports.saveFile = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg))
    }

    try {
        let extra = {}
        let file_type = detectiveTypeByFileMime(req.file.mimetype)
        if (file_type === 0) {
            extra = await getImageSize(req.file.path)
        }
        let data = {
            file_name: req.file.filename,
            file_type,
            file_ext: req.file.originalname.split('.').pop(),
            md5_code: req.file.md5,
            driver: 'local',
            key: req.file.path.substring('public/'.length, req.file.path.length).replace("\\", "/"),
            file_size: req.file.size,
            ...extra,
        }
        let aFile = await WechatFile.create(data)
        return res.json(res_data(aFile))
    } catch (error) {
        fs.unlink(req.file.path, () => { })
        return res.json(res_data(error, -1, error.toString()))
    }
}

/**
 * 更新文件 
 *
 * @param {*} req 
 *            title 组标识
 * @param {*} res 
 * @param {*} next 
 */
exports.updateFile = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(errors, -1, errors.errors[0].msg))
    }
    if (typeof req.body.id == 'undefined' || !req.body.id) {
        return res.json(res_data(null, -1, '文件ID必传'))
    }
    let oldFile = await WechatFile.findByPk(req.body.id)
    if (!oldFile) {
        fs.unlink(req.file.path, () => { })
        return res.json(res_data(null, -1, '不存在旧的文件记录'))
    }

    try {
        let extra = {}
        let file_type = detectiveTypeByFileMime(req.file.mimetype)
        if (file_type === 0) {
            extra = await getImageSize(req.file.path)
        }
        let data = {
            file_name: req.file.filename,
            file_type,
            file_ext: req.file.originalname.split('.').pop(),
            md5_code: req.file.md5,
            driver: 'local',
            key: req.file.path.substring('public\\'.length, req.file.path.length),
            file_size: req.file.size,
            ...extra,
        }
        let aFile = await WechatFile.update(data, {
            where: { id: oldFile.id }
        })
        fs.unlink(path.join("public", oldFile.key), () => { })
        return res.json(res_data(aFile))
    } catch (error) {
        return res.json(res_data(error, -1, error.toString()))
    }
}

/**
 * 删除文件 
 *
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteFile = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json(res_data(null, -1, errors.errors[0].msg))
    }
    let oldFile = await WechatFile.findByPk(req.body.id)
    if (!oldFile) {
        return res.json(res_data(null, -1, '不存在旧的文件记录'))
    }

    try {
        let filepath = path.join("public", oldFile.key)
        await oldFile.destroy()
        fs.unlink(filepath, () => { })
    } catch (error) {
        return res.json(res_data(null, -1, error.toString()))
    }

    return res.json(res_data())
}
