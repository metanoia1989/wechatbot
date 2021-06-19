const Bot = require('../bot');
const { WechatRoom, WechatContact } = require("../models/wechat");
const { fetchContactType, fetchWeixin } = require("../util/wechat");

/**
 * 同步所有群组数据
 * @param {Wechaty} that 
 */
async function initAllRoomData() {
    var items = await Bot.getInstance().Room.findAll();
    try {
        var data =  items.map(room=> {
            let { payload } = room
            return { 
                room_ident: payload.id,
                name: payload.topic
            }
        })
        WechatRoom.bulkCreate(data, { 
            fields: Object.keys(data[0]),
            updateOnDuplicate: ["name"] 
        })
        
    } catch (error) {
        console.log(`同步群组出错: ${error.toString()}`)    
    }
}

/**
 * 同步所有联系人数据
 * @param {Wechaty} that 
 */
async function initAllContactData() {
    var contacts = await Bot.getInstance().Contact.findAll();
    var self_id = Bot.getInstance().bot.userSelf().id
    try {
        var data =  contacts.map(contact => {
            let { payload } = contact
            if (typeof payload.id == 'undefined') {
                payload.id = contact.id
            }
            var type = fetchContactType(payload)
            var weixin = fetchWeixin(payload)
              
            // switch (contact.type()) {
            //     case that.Contact.Type.Personal:
            //         type = 'personal' 
            //         break;
            //     case that.Contact.Type.Official:
            //         type = 'official' 
            //         break;
            //     default:
            //         type = 'unkonwn'
            //         break;
            // }
            var contact_ident = payload.id
            delete payload.id
            return {
                ...payload,
                contact_ident,
                friend: payload.friend ? 1 : 0,
                star: payload.star ? 1 : 0,
                self: payload.id == self_id ? 1 : 0,
                type: type,
                // signature: payload.signature.replace("'",""),
                name: payload.name.replace("'",""),
                weixin, 
            }
        })   

        WechatContact.bulkCreate(data, { 
            fields: Object.keys(data[0]),
            updateOnDuplicate: ["weixin", "name", "friend", "alias", "avatar", "self", "start"],  // 他妈的不更新，垃圾啊 
        })
    } catch (error) {
        console.log(`同步联系人出错: ${error.toString()}`, error)    
    }
}

/**
 * 同步所有群组和好友   
 * @param {Wechaty} that 
 */
async function initAllSyncData() {
    await initAllRoomData(); 
    await initAllContactData(); 
}


module.exports = {
    initAllSyncData,    
    initAllRoomData,
    initAllContactData,
}