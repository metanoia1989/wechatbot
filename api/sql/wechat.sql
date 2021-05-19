-- 数据库设计

-- 联系人表
CREATE TABLE `ts_wechat_contact` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `contact_ident` VARCHAR(255) NOT NULL COMMENT '标识ID',
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
    UNIQUE INDEX `contact_ident` (`contact_ident`)
)
ENGINE=MyISAM
COLLATE='utf8_general_ci'
COMMENT='微信联系人表';


-- 群组表
CREATE TABLE `ts_wechat_room` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `room_ident` VARCHAR(255) NOT NULL COMMENT '标识ID',
    `name` VARCHAR(191) NOT NULL DEFAULT '' COMMENT '群组名' COLLATE 'utf8mb4_general_ci',
    `owner` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否拥有此群',
    `manage` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否是管理员',
    PRIMARY KEY (`id`),
    UNIQUE INDEX `room_ident` (`room_ident`)
)
ENGINE=MyISAM
COLLATE='utf8_general_ci'
COMMENT='微信群组表';


-- 联系人 群组关联表    
CREATE TABLE `ts_wechat_room_contact` (
    `room_ident` VARCHAR(255) NOT NULL COMMENT '群组',
    `contact_ident` VARCHAR(255) NOT NULL COMMENT '联系人标识ID',
    UNIQUE INDEX `relative` (`room_ident`, `contact_ident`)
)
ENGINE=InnoDB
COLLATE='utf8_general_ci'
COMMENT='微信群组联系人关联表';


--- 消息类型表 数量不多，直接写死到源码里
-- export enum MessageType {
--   Unknown = 0,

--   Attachment  = 1,    // Attach(6), 附件
--   Audio       = 2,    // Audio(1), Voice(34) 音频 语音
--   Contact     = 3,    // ShareCard(42) 名片卡
--   ChatHistory = 4,    // ChatHistory(19) 消息历史
--   Emoticon    = 5,    // Sticker: Emoticon(15), Emoticon(47)  表情
--   Image       = 6,    // Img(2), Image(3)  图片
--   Text        = 7,    // Text(1) 文本
--   Location    = 8,    // Location(48) 定位
--   MiniProgram = 9,    // MiniProgram(33) 小程序
--   GroupNote   = 10,   // GroupNote(53) 群通知
--   Transfer    = 11,   // Transfers(2000) 
--   RedEnvelope = 12,   // RedEnvelopes(2001)
--   Recalled    = 13,   // Recalled(10002) 撤销
--   Url         = 14,   // Url(5) URL
--   Video       = 15,   // Video(4), Video(43) 视频消息
-- }

--- 消息表
CREATE TABLE `ts_wechat_message` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `msg_ident` VARCHAR(255) NOT NULL COMMENT '消息标识ID',
    `filename` VARCHAR(255) NOT NULL DEFAULT '' COMMENT '文件名', 
    `fromId` VARCHAR(255) NOT NULL DEFAULT '' COMMENT '消息发送人ID', 
    `roomId` VARCHAR(255) COMMENT '所在群组ID，好友消息此字段为空', 
    `toId` VARCHAR(255)  COMMENT '消息发送的目标，如果为群组消息，则目标为群主ID', 
    `content` TEXT COMMENT '消息内容',
    `type` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '消息类型 0 未知 6 图片 7 文本',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '消息发送时间',
    PRIMARY KEY (`id`),
    UNIQUE INDEX `msg_ident` (`msg_ident`) 
)
ENGINE=MyISAM
COLLATE='utf8_general_ci'
COMMENT='微信群组表';

--- 微澜分馆与群组关联表，群组表也必须是InnoDB引擎，否则将会建表失败。 
CREATE TABLE `ts_wechat_to_group` (
    `groupid` INT(10) NOT NULL COMMENT '微澜分馆ID', 
    `room_ident` VARCHAR(255) NOT NULL COMMENT '微信群组标识', 
    UNIQUE INDEX `group_to_room` (`groupid`, `room_ident`),
    CONSTRAINT `fk_group`
    FOREIGN KEY (`groupid`) 
        REFERENCES `ts_group`(`groupid`) ON DELETE CASCADE
)
ENGINE=InnoDB
COLLATE='utf8_general_ci'
COMMENT='微澜分馆与微信群组关联表';
