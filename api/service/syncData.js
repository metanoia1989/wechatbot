const { WechatRoom, WechatRoomContact } = require("../models/wechat");

/**
 * 同步所有群组数据
 * @param {Wechaty} that 
 */
async function initAllRoomData(that) {
    var items = await that.Room.findAll();
    try {
        await WechatRoom.destroy({ truncate: true, cascade: false })
        await WechatRoomContact.destroy({ truncate: true, cascade: false })
        console.log(items.length)
        items.forEach(async ({ payload }) => {
            const room = WechatRoom.build({ 
                room_ident: payload.id,
                name: payload.topic
            })
            await room.save();
            const room_to_contacts = payload.memberIdList.map(memberId => {
                return { room_ident: payload.id, contact_ident: memberId }
            })
            await WechatRoomContact.bulkCreate(room_to_contacts)
        });
    } catch (error) {
        console.log(`同步群组出错: ${error.toString()}`)    
    }
}

/**
 * 同步所有联系人数据
 * @param {Wechaty} that 
 */
async function initAllContactData(that) {
    var contacts = await that.Contact.findAll();
    try {
        var data =  contacts.map(contact => {
            const { payload } = contact
        })
    } catch (error) {
        console.log(`同步联系人出错: ${error.toString()}`)    
        
    }
}

/**
 * 同步所有群组和好友   
 * @param {Wechaty} that 
 */
async function initAllSyncData(that) {
    await initAllRoomData(that); 
    await initAllContactData(that); 
}


module.exports = {
    initAllSyncData,    
    initAllRoomData,
    initAllContactData,
}