const Bot = require('../bot');
const { WechatRoom, WechatContact } = require("../models/wechat");
const { processContact } = require("../util/wechat");


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
    try {
        var data =  contacts.map(processContact)   
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

/**
 * 添加新的联系人数据到数据库
 * @param {Contact} contact 
 */
function addContactToDb(contact) {
    let item = processContact(contact) 
    WechatContact.bulkCreate([item], { 
        fields: Object.keys(item),
        updateOnDuplicate: ["weixin", "name", "friend", "alias", "avatar", "self", "start"],  // 他妈的不更新，垃圾啊 
    })
}


module.exports = {
    initAllSyncData,    
    initAllRoomData,
    initAllContactData,
    addContactToDb,
}