-- 数据库设计

-- 管理员表
CREATE TABLE `ts_wechat_admin` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL COMMENT '用户名',
    `nickname` VARCHAR(255) NOT NULL DEFAULT '未命名' COMMENT '昵称',
    `password` VARCHAR(64) COMMENT '密码',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '账号创建时间',
    `updated_at` TIMESTAMP NULL COMMENT '账号更新时间',
    `last_login_at` TIMESTAMP NULL COMMENT '最后登录时间',
    PRIMARY KEY (`id`),
    UNIQUE INDEX `username` (`username`)
)
ENGINE=InnoDB
COLLATE='utf8_general_ci'
COMMENT='bot管理员表';

CREATE TABLE `ts_wechat_token` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `uid` INT(10) UNSIGNED NOT NULL DEFAULT 1 COMMENT '所属用户',
    `type` VARCHAR(50) NOT NULL DEFAULT 'api' COMMENT 'token类型，api 访问api使用 bind 绑定微信号使用',
    `token` VARCHAR(255) NOT NULL COMMENT 'token值',
    `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'token状态 0 未启用 1 已启用',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '账号创建时间',
    `expired_at` TIMESTAMP NULL COMMENT '过期时间',
    PRIMARY KEY (`id`),
    UNIQUE INDEX `token` (`token`)
)
ENGINE=InnoDB
COLLATE='utf8_general_ci'
COMMENT='访问token表 给微澜社区调用';

INSERT IGNORE INTO  `ts_wechat_admin` (`id`, `username`, `nickname`, `password`)
VALUES (1, 'admin', '管理员', 'e10adc3949ba59abbe56e057f20f883e');

INSERT IGNORE INTO  `ts_wechat_token` (`id`, `uid`, `type`, `token`);
VALUES (1, 1, 'api', '8u1srcm0knyrd6w2q7l93de1fzei9f8k')

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
    `uid` INT(10) UNSIGNED NULL COMMENT '用户ID',
    `type` ENUM('unknown', 'personal', 'official') NOT NULL DEFAULT 'unknown' COMMENT '联系人类型',
    PRIMARY KEY (`id`),
    UNIQUE INDEX `contact_ident` (`contact_ident`)
)
ENGINE=InnoDB
COLLATE='utf8_general_ci'
COMMENT='微信联系人表';


-- 群组表
CREATE TABLE `ts_wechat_room` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `room_ident` VARCHAR(255) NOT NULL COMMENT '标识ID',
    `name` VARCHAR(191) NOT NULL DEFAULT '' COMMENT '群组名' COLLATE 'utf8mb4_general_ci',
    `groupid` INT(10) UNSIGNED NULL COMMENT '关联的微澜分馆ID',
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
    `fromId` VARCHAR(199) NOT NULL DEFAULT '' COMMENT '消息发送人ID' COLLATE 'utf8mb4_general_ci',
    `fromName` VARCHAR(199) COMMENT '消息发送人的名称' COLLATE 'utf8mb4_general_ci',
    `roomId` VARCHAR(255) COMMENT '所在群组ID，好友消息此字段为空',
    `roomName` VARCHAR(199) COMMENT '所在群组名，好友消息此字段为空' COLLATE 'utf8mb4_general_ci',
    `content` TEXT COMMENT '消息内容' COLLATE 'utf8mb4_general_ci',
    `type` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '消息类型 0 未知 6 图片 7 文本',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '消息发送时间',
    PRIMARY KEY (`id`),
    UNIQUE INDEX `msg_ident` (`msg_ident`)
)
ENGINE=InnoDB
COLLATE='utf8_general_ci'
COMMENT='微信群组表';

CREATE TABLE `ts_wechat_file` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`file_name` VARCHAR(100) NOT NULL COMMENT '原文件名',
	`file_type` TINYINT(1) NOT NULL COMMENT '文件类型 0:图片 1:视频 2: 音频 3 文本 4 其他',
    `file_ext` VARCHAR(30) NOT NULL COMMENT '文件后缀',
	`md5_code` VARCHAR(32) NOT NULL COMMENT '文件md5码',
    `driver` ENUM('local', 'qiniu', 'qcloud', 'alicloud') DEFAULT 'local' COMMENT '默认驱动',
	`key` VARCHAR(100) NOT NULL COMMENT '上传云存储时的key 或者 本地路径',
	`thumb_img` VARCHAR(255) NULL DEFAULT NULL COMMENT '缩略图',
	`preview_img` VARCHAR(255) NULL DEFAULT NULL COMMENT '预览图',
	`file_size` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0' COMMENT '文件大小（单位:字节）',
    `width` INT(10) NULL COMMENT '图片宽度',
    `height` INT(10) NULL COMMENT '图片高度',
	`is_horizontal` BIT(1) NULL DEFAULT NULL COMMENT '是否横图',
	`thumb_size` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0' COMMENT '缩略图大小(单位:字节)',
	`preview_size` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0' COMMENT '预览图大小(单位:字节)',
	`duration` INT(255) UNSIGNED NULL DEFAULT '0' COMMENT '视频时长 或 音频时长',
    `is_del` TINYINT(0) NOT NULL DEFAULT 0 COMMENT '是否删除',
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	`updated_at` TIMESTAMP NULL COMMENT '更新时间',
	PRIMARY KEY (`id`),
    UNIQUE INDEX `md5_code` (`md5_code`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
COMMENT='文件表';

CREATE TABLE `ts_wechat_room_welcome` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`room_ident` VARCHAR(100) NOT NULL COMMENT '群标识',
	`content` TEXT NULL COMMENT '欢迎语内容' COLLATE 'utf8mb4_general_ci',
	`img_id` INT(10) NULL COMMENT '欢迎语图片ID',
	`link_title` VARCHAR(50) NULL COMMENT '链接标题' COLLATE 'utf8mb4_general_ci',
	`link_desc` VARCHAR(199) NULL  COMMENT '链接描述' COLLATE 'utf8mb4_general_ci',
	`link_img_id` INT(10) NULL COMMENT '链接图片ID',
	`link_url` VARCHAR(255) NULL COMMENT '链接地址',
	`status` TINYINT(3) NULL DEFAULT '1' COMMENT '状态，1启用，0禁用',
	PRIMARY KEY (`id`),
    UNIQUE INDEX `room_ident` (`room_ident`)
)
COMMENT='群欢迎语'
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE `ts_wechat_material` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(190) NOT NULL COMMENT '标题',
    `content` TEXT NOT NULL COMMENT '内容',
	PRIMARY KEY (`id`),
    UNIQUE INDEX `title` (`title`)
)
COMMENT='文字素材表'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

CREATE TABLE `ts_wechat_link` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(190) NOT NULL COMMENT '标题',
    `description` VARCHAR(190) NULL COMMENT '描述',
    `img_url` VARCHAR(190) NOT NULL COMMENT '图片链接',
    `link_url` VARCHAR(190) NOT NULL COMMENT '链接地址',
	PRIMARY KEY (`id`),
)
COMMENT='链接表'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

--- 关键词回复表，用 tab 来展示不同类型的关键词
CREATE TABLE `ts_wechat_keyword` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`keyword` VARCHAR(255) NOT NULL COMMENT '关键词',
	`type` TINYINT(1) DEFAULT 1 COMMENT '关键词类型  1 普通关键词 2 事件关键词 3 入群关键词',
	`reply` VARCHAR(255) NULL COMMENT '普通回复内容' COLLATE 'utf8mb4_general_ci',
	`event` VARCHAR(255) NULL COMMENT '事件类型',
	`status` TINYINT(3) NULL DEFAULT '1' COMMENT '状态，1启用，0禁用',
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	`updated_at` TIMESTAMP NULL COMMENT '更新时间',
	PRIMARY KEY (`id`),
	UNIQUE INDEX `keyword` (`keyword`)
)
ENGINE=InnoDB
COLLATE='utf8_general_ci'
COMMENT='关键词回复表';

--- 好友欢迎语表
CREATE TABLE `ts_wechat_friend_welcome` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL COMMENT '名称',
	`content` text COMMENT '欢迎语内容' COLLATE 'utf8mb4_general_ci',
	`status` TINYINT(3) NULL DEFAULT '1' COMMENT '状态，1启用，0禁用',
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
	PRIMARY KEY (`id`),
	UNIQUE INDEX `name` (`name`)
)
ENGINE=InnoDB
COLLATE='utf8_general_ci'
COMMENT='好友欢迎语表';


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
'作为本馆馆员务必了解的信息都在这个页面一网打尽啦，一定要打开看一看！'
);

--- 插入默认关键词
INSERT INTO `ts_wechat_keyword` (`id`, `keyword`, `type`, `reply`, `event`, `status`, `created_at`, `updated_at`) VALUES
	(1, '募捐数据', 2, '', 'query-lib-donate', 1, '2021-08-21 04:03:20', '2021-08-21 19:41:16'),
	(2, '借阅数据', 2, NULL, 'query-lib-borrow', 1, '2021-08-21 04:03:20', NULL),
	(3, '微澜', 3, NULL, NULL, 1, '2021-08-21 04:03:20', '2021-08-21 17:23:55'),
	(7, '善哉', 1, '善哉，善哉！', NULL, 1, '2021-08-21 18:05:41', '2021-08-21 18:05:41'),
	(8, '指令帮助', 1, '小新支持以下指令：\n募捐数据 <分馆名称>   ➡️ 查阅分馆在联劝网上的募捐数据\n借阅数据 <分馆名称>   ➡️ 查阅分馆在益迪云图上的借阅数据\n如果有更多的需求，请向小新反馈哦！', NULL, 1, '2021-08-21 20:28:56', '2021-08-21 20:30:04');

INSERT INTO `ts_wechat_friend_welcome` (`name`, `content`) VALUES
('默认好友欢迎语', '您好，亲爱的伙伴，我是小新，欢迎您成为新公民计划和微澜图书馆伙伴，持续关注我们的工作。
 
如果您已经报名志愿者或者对我们进行任何形式的月捐（分馆或总馆馆员，馆东、新公民计划机构月捐），需要入群，可以按照报名过程提示给“小澜”（微信：weilanzhushou）发送口令。
 
了解微澜图书馆方式：
1、微澜社区：http://wvlb.cc/duty （各分馆小组，微澜的日常服务记录，日志，微澜的运营）
2、微澜地图：http://park.sanzhi.org.cn/index.php?app=group&ac=map
3、加入微澜图书馆：http://park.sanzhi.org.cn/index.php?app=user&ac=welcome
 
参与和支持我们的方式：
1、新公民计划月捐：http://wvlb.cc/monthlygiving
2、腾讯公益捐赠：http://wvlb.cc/givingtowavelib0（单次捐或者给微澜总馆月捐）
3、图书捐赠：http://wvlb.cc/givingbook（书已有确定目录）
4、组织和企业合作方式：http://wvlb.cc/bc
  
其他入口：新公民计划和微澜图书馆公众号
 
如果您对议题本身感兴趣，想参与议题讨论或者研究，传播，也可以留言告诉小新。
小新朋友圈可见我们的部分工作动态和日常，欢迎了解；
也欢迎通过微博/豆瓣/视频号 @新公民计划与我们互动，让更多朋友了解和加入我们。
如果您有任何疑问或者需要咨询的问题，欢迎留言给小新，我们将由人工进行解答。
 
其他联系方式：
媒体采访和传播合作：廖细雄 13671310237
捐赠和企业合作：吴丽丽  微信：WLily2177')
