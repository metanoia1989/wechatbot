# 后端开发说明  
这个项目其实发布到群里了，不过是我自己发起的，别人没多大的兴趣来看。开源团队其实很松散的，我自己来做出来好了，一个人是最灵活的。
vue-admin-template 这个怎么构建一个完善的后台，我还不是很熟，所以先把api写好，这样就不用在前后端来回切换了。    

后续如果有前端来参与开发，所以文档工作需要做好，用swagger来生成文档，PostMan 是支持直接导入的。 


先尽量见得地来做，后续再完善。下面这些要求，用最简单的方式来实现，越简单越好。    

接口开发
用户登陆 ts_user 表的管理员都可以登陆这个后台   
wechat bot 登陆状态，登陆以及注销操作   
好友列表、群列表、群详情，甚至可以查看历史消息记录，图片、文件忽略，一律记录文字
消息历史记录，好友消息，群消息  
定时任务，推送消息给好友和群    
消息推送接口，接收参数，推送给相应的群和好友    

# 细分开发任务
* [x] `.env`文件 ，然后配置文件里读环境变量 
* [x] request 参数验证  
* [x] 日志记录库    
* [x] ORM模型来做增删改查，以及保持原生的查询能力   
* [x] 登录以及jwt权限验证   
* [ ] 移植 wechaty-web-panel 的代码，非常的完善，把表建好，就可以写了   
 * [ ] 初始化微信bot，将好友和群入库
 * [ ] 监听各种事件消息，设计相关数据表，入库    
* [ ] 能够推送到指定的群和好友消息，多种形式的消息类型，提供这类函数，然后开放成api    
* [ ] OAuth2的appid与appsecret，提供开放的接口，提供给社区服务调用。或者生成用户token，根据token来提供相关的机器人使用。        
* [ ] 定时任务功能  
* [ ] 使用多个bot示例，支持多个用户登录使用。【哈哈，这个后面再说哈哈】     

# 会用到的包
Node.js MySQL Client https://github.com/mysqljs/mysql       
IORedis https://github.com/luin/ioredis     
Sequelize https://sequelize.org/master/index.html       

# 很好的CMS
Keystone The most powerful headless CMS for Node.js — built with GraphQL and React https://github.com/keystonejs/keystone        
Strapi  Open source Node.js Headless CMS to easily build customisable APIs  https://github.com/strapi/strapi        
Ghost 真心漂亮 👻 The #1 headless Node.js CMS for professional publishing https://github.com/TryGhost/Ghost        

# 学习参考
其实可以参考网上的wechat客户端，来看看人家是怎么做的。
致力于打造macOS和Linux桌面下最好用的微信（wechat）客户端https://github.com/eNkru/freechat       
electronic-wechat https://github.com/geeeeeeeeek/electronic-wechat      

另一方面学习express的企业级开发是怎样的     
Express RealWorld example app https://github.com/gothinkster/node-express-realworld-example-app     
使用 Express + MongoDB 搭建多人博客 https://github.com/nswbmw/N-blog        
基于 node.js + Mongodb 构建的后台系统 很完善 https://github.com/bailicangdu/node-elm   
⭐ MEVN Full stack JS web app boilerplate with NodeJS, Express, Mongo and VueJS https://github.com/icebob/vue-express-mongo-boilerplate     
👕 👖 📦 A sample web and mobile application built with Node, Express, React, React Native, Redux and GraphQL.  https://github.com/atulmy/crate     
🔈 Websocket project based on vue（基于vue2.0的实时聊天项目）  https://github.com/hua1995116/webchat        

Node.js 学习资料    
Nodejs学习笔记以及经验总结 https://github.com/chyingp/nodejs-learning-guide     
❄️ a short introduction to node.js https://github.com/maxogden/art-of-node      
Practical Node.js, 1st and 2nd Editions [Apress] 📓  https://github.com/azat-co/practicalnode       
大前端技术笔记 https://github.com/biaochenxuying/blog       
📗🌐 🚢 Comprehensive and exhaustive JavaScript & Node.js testing best practices (March 2021)  https://github.com/goldbergyoni/javascript-testing-best-practices        
✅ The Node.js best practices list (March 2021) https://github.com/goldbergyoni/nodebestpractices   
Express 例子和文章 https://github.com/wabg/awesome-express      
Learn to Use the New Router in ExpressJS 4.0 https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4     