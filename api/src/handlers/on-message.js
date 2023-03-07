import { WechatMessage } from "../models/wechat.js";
import { contactSay, roomSay } from "../service/index.js";
import { getContactTextReply, getRoomTextReply } from "../service/msg-reply.js";
import { formatDate } from "../util/datetime.js";
import { delay } from "../util/server.js";
/**
 * 消息入库处理，仅处理文本消息
 * @param {*} bot bot实例
 * @param {*} msg 消息主体
 */
async function msgToDatabase(bot, msg, room = { roomId: "", roomName: "" }) {
    const type = msg.type();
    if (type != bot.Message.Type.Text) {
        return;
    }
    const contact = msg.talker(); // 发消息人
    let contactId = contact.id || '111';
    const contactName = contact.name();
    let content = msg.text();
    let msgRow = {
        ...room,
        fromId: contactId,
        fromName: contactName,
        msg_ident: msg.id,
        content,
        type: 6,
        created_at: formatDate(await msg.date())
    };
    await WechatMessage.create(msgRow);
}
/**
 * 根据消息类型过滤私聊消息事件
 * @param {*} that bot实例
 * @param {*} msg 消息主体
 */
async function dispatchFriendFilterByMsgType(that, msg) {
    try {
        const type = msg.type();
        const contact = msg.talker(); // 发消息人
        const isOfficial = contact.type() === that.Contact.Type.Official;
        let content = '';
        let replys = [];
        switch (type) {
            case that.Message.Type.Text:
                content = msg.text();
                if (!isOfficial) {
                    await msgToDatabase(that, msg);
                    console.log(`发消息人${await contact.name()}:${content}`);
                    if (content.trim()) {
                        replys = await getContactTextReply(that, contact, content);
                        for (let reply of replys) {
                            await delay(1000);
                            await contactSay(contact, reply);
                        }
                    }
                }
                else {
                    console.log('公众号消息');
                }
                break;
            case that.Message.Type.Emoticon:
                console.log(`发消息人${await contact.name()}:发了一个表情`);
                break;
            case that.Message.Type.Image:
                console.log(`发消息人${await contact.name()}:发了一张图片`);
                break;
            case that.Message.Type.Url:
                console.log(`发消息人${await contact.name()}:发了一个链接`);
                break;
            case that.Message.Type.Video:
                console.log(`发消息人${await contact.name()}:发了一个视频`);
                break;
            case that.Message.Type.Audio:
                console.log(`发消息人${await contact.name()}:发了一个视频`);
                break;
            default:
                console.log(`发消息人${await contact.name()}:发了一个无法识别的消息类型`);
                break;
        }
    }
    catch (error) {
        console.log('监听消息错误', error);
    }
}
/**
 * 根据消息类型过滤群消息事件
 * @param {*} that bot实例
 * @param {*} room room对象
 * @param {*} msg 消息主体
 */
async function dispatchRoomFilterByMsgType(that, room, msg) {
    const contact = msg.talker(); // 发消息人
    const contactName = contact.name();
    const roomName = await room.topic();
    const type = msg.type();
    const userSelfName = that.userSelf().name();
    let content = '';
    let replys = '';
    let contactId = contact.id || '111';
    let contactAvatar = await contact.avatar();
    switch (type) {
        case that.Message.Type.Text:
            content = msg.text();
            console.log(`群名: ${roomName} 发消息人: ${contactName} 内容: ${content}`);
            await msgToDatabase(that, msg, { roomId: room.id, roomName });
            const mentionSelf = content.includes(`@${userSelfName}`);
            if (mentionSelf) {
                content = content.replace(/@[^,，：:\s@]+/g, '').trim();
                replys = await getRoomTextReply(that, content, contactName, contactId, contactAvatar, room);
                for (let reply of replys) {
                    await delay(1000);
                    await roomSay(room, contact, reply);
                }
            }
            break;
        case that.Message.Type.Emoticon:
            console.log(`群名: ${roomName} 发消息人: ${contactName} 发了一个表情`);
            break;
        case that.Message.Type.Image:
            console.log(`群名: ${roomName} 发消息人: ${contactName} 发了一张图片`);
            break;
        case that.Message.Type.Url:
            console.log(`群名: ${roomName} 发消息人: ${contactName} 发了一个链接`);
            break;
        case that.Message.Type.Video:
            console.log(`群名: ${roomName} 发消息人: ${contactName} 发了一个视频`);
            break;
        case that.Message.Type.Audio:
            console.log(`群名: ${roomName} 发消息人: ${contactName} 发了一个语音`);
            break;
        default:
            break;
    }
}
async function onMessage(msg) {
    const room = msg.room(); // 是否为群消息
    const msgSelf = msg.self(); // 是否自己发给自己的消息
    if (msgSelf)
        return;
    if (room) {
        dispatchRoomFilterByMsgType(this, room, msg);
    }
    else {
        dispatchFriendFilterByMsgType(this, msg);
    }
}
export default onMessage;
