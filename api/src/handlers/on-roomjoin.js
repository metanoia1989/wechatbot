import { FileBox } from "file-box";
import path from "path";
import * as wechaty from "wechaty";
import { WechatRoomWelcome } from "../models/wechat.js";
import { pushJob } from "../util/queue.js";
import Bot from "../bot.js";

/**
 * 群中有新人进入，触发欢迎语
 */
async function onRoomjoin(room, inviteeList, inviter, date) {
    const nameList = inviteeList.map((c) => c.name()).join(',');
    const roomName = await room.topic();
    // 非微澜相关的群，不发送欢迎语
    if (roomName.indexOf("微澜") === -1) {
        return;
    }
    var welcome = await WechatRoomWelcome.getWelcomeByIdent(room.id);
    if (!welcome) {
        console.log(`群：${roomName}, ${room.id} 不存在欢迎语`);
        return;
    }
    var content = welcome.content ? welcome.content.replace('{{username}}', nameList) : `欢迎${nameList}加入本群！`;
    console.log(`群名： ${roomName} ，加入新成员： ${nameList}, 邀请人： ${inviter}`);
    setTimeout(() => {
        pushJob(async () => {
            room.say(content);
            if (welcome.img) {
                const file = FileBox.fromUrl(welcome.img.key);
                room.say(file);
            }
            if (welcome.link_title && welcome.link_img && welcome.link_url) {
                const linkPayload = new Bot.getInstance().UrlLink({
                    title: welcome.link_title,
                    description: welcome.link_desc || '',
                    thumbnailUrl: welcome.link_img.key,
                    url: welcome.link_url
                });
                room.say(linkPayload);
            }
        });
    }, 5000);
}
export default onRoomjoin;
