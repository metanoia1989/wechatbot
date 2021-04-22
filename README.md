# 微信机器人
wechaty 是目前最成熟的微信机器人SDK，而且由于UOS的微信客户端导致微信web版复活了。   
微澜图书馆社区需要一个推送消息给群的功能，所以来研究一下，wechaty也有相关的生态。   

wechaty-getting-started https://github.com/wechaty/wechaty-getting-started      
微信小秘书 https://github.com/gengchen528/wechat-assistant  

**后端管理 使用 Vue-Element-Admin**     
Web控制面板，免得自己来开发一套 https://github.com/gengchen528/wechaty-web-panel            
看了一下，web面板没有开源，还是要自己来开源一套。看界面用的是 vue-element-admin，可以自己来用一套。      
然后这个详细的权限控制我还不熟，就不用多复杂的权限控制，菜单权限直接写死好了。  

用 node.js express 来写服务，来写接口。     


**微信个人号消息发送频率限制**      
尽量使用延时函数，防止被检测出类似机器人行为操作导致被微信团队禁止登录Web版本风险，避免被检测出机器人特征。    
需要给出一个消息队列来，所有要发的消息全部入消息队列，然后消息按频率出列，避免被封禁。  

一小时内的发送量被限制了    

微信发送信息频率上限？ #149 https://github.com/Urinx/WeixinBot/issues/149       

**wechaty的有趣插件**       
Using Plugin with Wechaty https://wechaty.js.org/docs/tutorials/using-plugin-with-wechaty       
RoomConnector	rooms together with 1:N, M:1, and M:N modes     
FriendshipAccepter	friendship automatically, and say/do something for greeting.        
RoomInviter	user to rooms by keyword        
MessageAwaiter	for a particular message using await syntax 

Using Vorpal with Wechaty 【聊天模式的命令行】 https://wechaty.js.org/docs/tutorials/using-vorpal-with-wechaty      

# 需求及开发任务
## 最紧迫的功能        
需要开发的功能有，获取群ID并且绑定社区分馆ID            
公告推送功能，推送设置推送公告给指定的群            
分馆相关信息推送给相关分馆的群。        


## 微信Bot api    
利用 wechaty 提供的SDK来开发REST API，来供其他服务调用。        
wechaty 本身是支持 gRPC 的，而官方也把 gRPC 生态系统应用了，开发了 openapi 包。     
Wechaty gRPC Service https://github.com/wechaty/grpc        
Wechaty REST API Server with OpenAPI https://github.com/wechaty/openapi         

看看 appid appsecret 这个是怎么生成怎么搞的，我也来一套。   
私聊关键词恢复，关键词查询      
相关通知需要及时、定时推送到相关的群        
通过指令进行绑定微信群、查询活动、活动推送。后续的活动都可以通过群发送指令来了。        
自动通过好友、自动同意入群、绑定/解绑微信群、#活动指令交互、消息池消息推送（同步/异步）、异常退出监测并重启。       
微澜技术群里，后去有pull request，可以自动发送到群里        
写个web管理界面，通过网页来显示二维码来登录，来退出，来执行操作。       

参考商业的微信bot开发商的api    
E云API https://www.wkteam.cn/   
PostMan在线测试：https://documenter.getpostman.com/view/1268847/SzKQxKf5?version=latest     

管理后台开发        
web管理页面，管理微信bot，调用微信bot的api。    
* bot登陆页面，查看登陆状态，登陆后记录登陆时间（直接存缓存就行了），记录登陆记录   
* 好友列表及群列表查看，能够查看头像（需要缓存头像），能够查看ID，方便或许精准推送。    
* 关键词回复，触发关键词时将会回复，群里需要@能触发 
* 群欢迎语设置，加好友欢迎语设置    
* 创建群，修改群名，群公告，群备注，设置管理员，群二维码，群保存到通讯录，添加群成员，邀请群成员，群二维码群@           
* 定时任务设置，定时推送消息给指定好友、指定群    
* 将群跟微澜分馆绑定，分馆相关文档、动态、活动统一发布到相关群里。写api允许社区来调用消息发送接口。   
* 成了相应分馆馆员后，可以在分馆主页查看群二维码。馆东也有。这个要写API来供调用。     
* #指令交互，活动查询、报名，馆员馆东报名 ，聊天记录及备份    
* 群聊天记录，需要开启后允许记录，一旦记录后每有新群员入群都会自动提醒，并且允许群员设置关闭记录自身信息。  
 群记录后续可以生成一日、一周、一月的记录，沉淀到社区中，只允许相应分馆检索。   
* 附件发送，查看资料库，展示公开的资料。允许搜索，下载请求。    