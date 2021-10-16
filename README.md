微信机器人
=========

<a href="http://commitizen.github.io/cz-cli/">
   <img alt="" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg">
</a>

wechaty 是目前最成熟的微信机器人SDK，而且由于UOS的微信客户端导致微信web版复活了。   
微澜图书馆社区需要一个推送消息给群的功能，所以来研究一下，wechaty也有相关的生态。   

技术栈：        
管理后台 vue-element-admin      
restapi express + wechaty       



安装部署
========

bot 部署，进入 api 目录
```sh
$ cd api
$ docker build -t bot .
$ cp .example.env .env # 然后修改相应的配置项
DB_HOSTNAME=host.docker.internal  # 这一样来访问host的数据库
$ docker run \
    --privileged \
    -p 8999:8999 \
    -d \
    -v $(pwd):/bot \
    --name bot \
    --add-host host.docker.internal:host-gateway \
    bot
$ docker logs -f bot # 查看日志即可扫码
# 后续更新只需要重新git拉取代码，然后重启容器即可   
```

后台管理部署
```sh
$ cd admin
$ yarn install
$ yarn run build:prod
# 将 dist 下的文件部署到网站 /bot-admin 目录下
# 访问 http://xxxxxx/bot-admin  
```


开发事项
========

目前 bot-api 开发了消息发送的功能，后台管理进度为零。   

* [x] bot登陆页面，查看登陆状态，登陆后记录登陆时间（直接存缓存就行了），记录登陆记录   
    * ts_wechat_admin表用户登陆 
    * wechat bot 登陆状态，登陆以及注销操作     
* [x] 群欢迎语设置，允许发送文字、图片、链接    
* [x] 好友申请处理
* [x] 将微信群与微澜分馆绑定，当分馆有消息时，推送消息入群。
* [x] 监听各种事件消息，设计相关数据表，入库。新群组和新好友以及新消息需要入库。后续padlocal才有意义。   
* [ ] OAuth2的appid与appsecret，提供开放的接口，提供给社区服务调用。或者生成用户token，根据token来提供相关的机器人使用。        
* [ ] openapi 文档生成，参考 wechaty的openapi.yml文件怎么写。   
* [ ] 定时任务功能  
* [x] 关键词回复，触发关键词时将会回复，群里需要@能触发 



注意事项
========

web协议，已知的问题有：
1. 好友ID和群ID会随着登录变化
2. 无法发送图文消息
3. 发送消息@群好友是无效的
4. 发送图片有限制，好像超过100张，无法发送

目前使用的 simplepad 协议，同步群组需要将群组加入通讯录。   
simplepad 注册地址 http://121.199.64.183:8866/user    



微信bot库及项目   
===============

* ItChat https://github.com/luvletter2333/ItChat      
* LeaveXChat 使用 Telegram Bot 收发 WeChat  https://github.com/UnsignedInt8/leavexchat-bot       
* 智能微秘书客户端 https://github.com/leochen-g/wechat-assistant-pro        


LICENSE
=======

![](http://www.gnu.org/graphics/gplv3-127x51.png)

Copyright © 2021 Adam Smith

This project is licensed under version 3 of the GNU General Public License.
