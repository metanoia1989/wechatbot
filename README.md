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

# 设置容器自启，删除容器后重新构建时使用
$ docker update --restart=always bot
```

OPENAPI 文档访问：<http://localhost:8999/api-docs>      

后台管理部署
```sh
$ cd admin
$ yarn install
$ yarn run build:prod
# 将 dist 下的文件部署到网站 /bot-admin 目录下
# 访问 http://xxxxxx/bot-admin  
```

机器人本地调试方法
===============

使用 simplepad 付费协议，微信登陆在人家的服务器上，会把消息转发给运行 wechaty 的客户端上。
如果同时运行两个客户端，只有一个客户端能够接收到消息。所以本地调试时，需要停止服务器上的wechaty服务。

或者本地调试使用 web 协议，web协议虽然不稳定容易掉线，但是本地调试绰绰有余了。  

本地调试需要修改两处代码，后续可以设置一个调试模式的环境变量，然后根据这个flag来切换不同的协议。

```js
// api/bot.js
// 新建 Wechaty 实例时，取消 puppet，则协议默认为 web协议
this.bot = new Wechaty({
    name,
    // puppet,
});

// api/handlers/on-scan.js
// simplepad 协议的登陆跟其他协议有区别，切换导出的方法
// module.exports = onSimplePadScan
module.exports = onScan
```

这样就可以使用web协议来测试了，建议使用【小号】来调试，避免微信风控影响到自己的微信号。

开发事项
========

消息发送API暂未进行权限验证，后续需要添加，避免被恶意调用。 

* [x] bot登陆页面，查看登陆状态，登陆后记录登陆时间（直接存缓存就行了），记录登陆记录   
    * ts_wechat_admin表用户登陆 
    * wechat bot 登陆状态，登陆以及注销操作     
* [x] 群欢迎语设置，允许发送文字、图片、链接    
* [x] 好友申请处理
* [x] 将微信群与微澜分馆绑定，当分馆有消息时，推送消息入群。
* [x] 监听各种事件消息，设计相关数据表，入库。新群组和新好友以及新消息需要入库。后续padlocal才有意义。   
* [ ] OAuth2的appid与appsecret，提供开放的接口，提供给社区服务调用。或者生成用户token，根据token来提供相关的机器人使用。        
* [x] openapi 文档生成，使用 `express-jsdoc-swagger` 这个库
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
