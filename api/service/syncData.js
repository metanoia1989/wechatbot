const { WechatRoom, WechatRoomContact, WechatContact } = require("../models/wechat");

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
    var self_id = that.userSelf().id
    try {
        var data =  contacts.map(contact => {
            const { payload } = contact

            var type = 'unkonwn'
            switch (contact.type()) {
                case that.Contact.Type.Personal:
                    type = 'personal' 
                    break;
                case that.Contact.Type.Official:
                    type = 'official' 
                    break;
                default:
                    type = 'unkonwn'
                    break;
            }
            
            var contact_ident = payload.id
            delete payload.id
            return {
                ...payload,
                contact_ident,
                friend: payload.friend ? 1 : 0,
                star: payload.star ? 1 : 0,
                self: payload.id == self_id ? 1 : 0,
                type: type,
                signature: payload.signature.replace("'",""),
                name: payload.name.replace("'",""),
            }
        })
        await WechatContact.destroy({ truncate: true, cascade: false })
        WechatContact.bulkCreate(data, { 
            fields: Object.keys(data[0]),
            updateOnDuplicate: ["contact_ident"],
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