-- 数据库设计

-- 用户表
CREATE TABLE `ts_wechat_contact` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `ident` VARCHAR(255) NOT NULL COMMENT '标识ID',
    `weixin` VARCHAR(255) COMMENT '微信号',
    `self` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否是自己',
    `friend` TINYINT(1) NOT NULL DEFAULT 2 COMMENT '是否是好友 0 no 1 yes 2 unknown',
    `name` VARCHAR(191) NOT NULL DEFAULT '' COMMENT '昵称' COLLATE 'utf8mb4_general_ci',
    `signature` VARCHAR(191)  COMMENT '签名' COLLATE 'utf8mb4_general_ci',
    `alias` VARCHAR(191) NOT NULL DEFAULT '' COMMENT '别名' COLLATE 'utf8mb4_general_ci',
    `gender` TINYINT(1) NOT NULL DEFAULT 2 COMMENT '性别 0 女 1 男 2 未知',
    `star` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否星标',
    `province` VARCHAR(50) COMMENT '省份',
    `city` VARCHAR(50) COMMENT '城市',
    `avatar` VARCHAR(255) COMMENT '头像',
    `type` ENUM('unknown', 'personal', 'official') NOT NULL DEFAULT 'unknown' COMMENT '联系人类型',
    PRIMARY KEY (`id`),
    UNIQUE INDEX `ident` (`ident`)
)
ENGINE=MyISAM
COLLATE='utf8_general_ci'
COMMENT='微信联系人表'