import Bot from "../bot.js";
import { WechatFriendWelcome } from "../models/wechat.js";
import { contactSay } from "../service/index.js";
import { addContactToDb } from "../service/syncData.js";
import { delay } from "../util/server.js";

/**
 * 好友添加
 */
async function onFriend(friendship) {
    let logMsg, hello;
    let config = {
        autoAcceptFriend: true
    };
    try {
        let name = friendship.contact().name();
        hello = friendship.hello();
        logMsg = name + '，发送了好友请求';
        console.log(logMsg);
        if (config.autoAcceptFriend) {
            switch (friendship.type()) {
                case Bot.getInstance().Friendship.Type.Receive:
                    // 3秒后添加好友
                    await delay(3000);
                    await friendship.accept();
                    await addContactToDb(friendship.contact());
                    break;
                case Bot.getInstance().Friendship.Type.Confirm:
                    logMsg = '已确认添加好友：' + name;
                    let contact = await Bot.getInstance().Contact.load(friendship.contact().id);
                    let welcome = await WechatFriendWelcome.findOne({ where: {
                            status: 1, name: '默认好友欢迎语'
                        } });
                    if (welcome) {
                        await contactSay(contact, { type: 1, content: welcome.content });
                    }
                    else {
                        await contactSay(contact, { type: 1, content: "hello，我是小新" });
                    }
                    console.log(logMsg);
                    break;
            }
        }
        else {
            console.log('未开启自动添加好友功能，忽略好友添加');
        }
    }
    catch (e) {
        logMsg = e;
        console.log('添加好友出错：', logMsg);
    }
}
export default onFriend;
