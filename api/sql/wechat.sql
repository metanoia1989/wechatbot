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
    `content` TEXT COMMENT '消息内容' COLLATE 'utf8mb4_general_ci',
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

-------------------------------------------------------------------------- 
-------------------------------------------------------------------------- 
-- Web 协议的群组ID 和 联系人ID会变，瞬间上面的表设计都没啥卵用了
-- 设计两张表，微澜的微信群表【人工手动维护】，微信群与微澜分馆关联表【也是人力维护】
-- 然后发送消息可以通过群名，可以通过微澜分馆ID 
-------------------------------------------------------------------------- 
-------------------------------------------------------------------------- 
CREATE TABLE `ts_wechat_room_names` (
    `room_name_id` INT(10) NOT NULL AUTO_INCREMENT COMMENT '微信群ID', 
    `room_name` VARCHAR(191) NOT NULL COMMENT '微信群名称，必须保证唯一' COLLATE 'utf8mb4_general_ci',
    PRIMARY KEY (`room_name_id`),
    UNIQUE INDEX `room_name` (`room_name`)
)
ENGINE=InnoDB
COLLATE='utf8_general_ci'
COMMENT='微澜的微信群组名称表 给Web协议使用';


CREATE TABLE `ts_wechat_room_to_group` (
    `groupid` INT(10) NOT NULL COMMENT '微澜分馆ID', 
    `room_name_id` INT(10) NOT NULL COMMENT '微澜微信群的ID', 
    UNIQUE INDEX `unique_ident` (`groupid`, `room_name_id`),
    CONSTRAINT `fk_wechat_name`
    FOREIGN KEY (`room_name_id`) 
        REFERENCES `ts_wechat_room_names`(`room_name_id`) ON DELETE CASCADE
)
ENGINE=InnoDB
COLLATE='utf8_general_ci'
COMMENT='微澜分馆与微信群关联表 给Web协议使用';

CREATE TABLE `ts_wechat_room_welcome` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`group_name` VARCHAR(100) NOT NULL COMMENT '群名',
	`content` TEXT NULL COMMENT '欢迎语内容' COLLATE 'utf8mb4_general_ci',
	`img_url` VARCHAR(255) NOT NULL DEFAULT '' COMMENT '欢迎语图片', 
	`link_title` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '链接标题' COLLATE 'utf8mb4_general_ci',
	`link_desc` VARCHAR(199) NOT NULL DEFAULT '' COMMENT '链接描述' COLLATE 'utf8mb4_general_ci', 
	`link_img` VARCHAR(255) NOT NULL DEFAULT '' COMMENT '链接图片', 
	`link_url` VARCHAR(255) NOT NULL DEFAULT '' COMMENT '链接地址', 
	`status` TINYINT(3) NULL DEFAULT '1' COMMENT '状态，1启用，0禁用',
	PRIMARY KEY (`id`),
    UNIQUE INDEX `group_name` (`group_name`)
)
COMMENT='群欢迎语'
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

INSERT INTO `ts_wechat_room_welcome` 
(`group_name`, `content`, `link_title`, `link_desc`, `link_img`, `link_url`)
VALUES 
('默认欢迎语', 
'欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。
进群后请修改群昵称，与你报名所使用的称呼一致。
下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。
如果有什么问题，欢迎在群内提问。', 
'候任馆员必读', 
'作为本馆馆员务必了解的信息都在这个页面一网打尽啦，一定要打开看一看！',
'http://park.sanzhi.org.cn/cache/slide/0/0/748/1.png',
'http://park.sanzhi.org.cn/index.php?app=article&ac=show&id=1203'
);


INSERT INTO `ts_wechat_room_welcome` 
(`group_name`, `content`, `img_url`, `link_title`, `link_desc`, `link_img`, `link_url`, `status`) 
VALUES 
('微澜技术小组200', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组201', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组202', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组203', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组204', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组205', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组206', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组207', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组208', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组209', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组210', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组211', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组212', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组213', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组214', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组215', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组216', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组217', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组218', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组219', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组220', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组221', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组222', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组223', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组224', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组225', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组226', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组227', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组228', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0),
('微澜技术小组229', '欢迎新伙伴@{{username}}加入本馆，让我们携手为小读者打开一片新天地。\n进群后请修改群昵称，与你报名所使用的称呼一致。\n下面是本馆新馆员务必了解的一些信息，请点开链接查看，按照页面提示做相应操作。\n如果有什么问题，欢迎在群内提问。', '', '', '', '', '', 0);