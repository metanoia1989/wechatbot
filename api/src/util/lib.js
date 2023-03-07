/**
 * 获取星座的英文
 * @param {*} msg
 */
function getConstellation(astro) {
    if (astro.includes('白羊座')) {
        return 'aries';
    }
    if (astro.includes('金牛座')) {
        return 'taurus';
    }
    if (astro.includes('双子座')) {
        return 'gemini';
    }
    if (astro.includes('巨蟹座') || astro.includes('钜蟹座')) {
        return 'cancer';
    }
    if (astro.includes('狮子座')) {
        return 'leo';
    }
    if (astro.includes('处女座')) {
        return 'virgo';
    }
    if (astro.includes('天平座') || astro.includes('天秤座') || astro.includes('天瓶座') || astro.includes('天枰座')) {
        return 'libra';
    }
    if (astro.includes('天蝎座')) {
        return 'scorpio';
    }
    if (astro.includes('射手座')) {
        return 'sagittarius';
    }
    if (astro.includes('射手座')) {
        return 'sagittarius';
    }
    if (astro.includes('摩羯座')) {
        return 'capricorn';
    }
    if (astro.includes('水瓶座')) {
        return 'aquarius';
    }
    if (astro.includes('双鱼座')) {
        return 'pisces';
    }
}
/**
 * 生成回复内容
 * @param type 内容类型
 * @param content 内容
 * @param url 链接
 * @returns {[{type: *, content: *, url: *}]}
 */
function msgArr(type = 1, content = '', url = '') {
    let obj = { type: type, content: content, url: url };
    return [obj];
}
/**
 * 获取所有定时任务的job名
 *
 */
function getAllSchedule() {
    for (let i in schedule.scheduledJobs) {
        console.log(i);
    }
}
async function generateRoomImg(list, options) {
    const { sizeInfo, titleInfo, background, roomName } = options;
    list = await cropImg(list, sizeInfo.size);
    const initOptions = {
        title: titleInfo.title || roomName,
        centerSize: sizeInfo.centerSize,
        space: sizeInfo.space,
        circleSpace: sizeInfo.space,
        size: sizeInfo.size,
        x: 0,
        y: 0,
        backWid: sizeInfo.width,
        backHei: sizeInfo.height,
        marginBottom: sizeInfo.bottom, // 距离底部高度
    };
    const mc = new MCanvas({
        width: initOptions.backWid,
        height: initOptions.backHei,
        backgroundColor: '#ffffff',
    });
    mc.background(background, {
        type: 'contain',
    });
    const info = __beforePatternCircle(list, initOptions);
    patternCircle(mc, list, info, initOptions);
    drawTitle(mc, initOptions.title, titleInfo);
    const base64 = await mc.draw({ type: 'jpg', quality: 1 });
    console.log('生成成功！');
    // var base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
    // var dataBuffer = Buffer.from(base64Data, 'base64')
    // fs.writeFile('image.jpg', dataBuffer, function (err) {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     console.log('保存成功！')
    //   }
    // })
    return base64;
}
/**
 * 获取群头像列表
 * @param {*} roomObj
 * @param {*} roomName
 * @param {*} name
 */
async function getRoomAvatar(roomObj, roomName, name) {
    let memberList = [];
    const room = await getRoom(roomName); // 先获取缓存中是否存在已经获取的头像
    if (room && room.list) {
        memberList = room.list;
    }
    else {
        const list = await getRoomAvatarList(roomObj, name);
        const obj = { name: roomName, list };
        await addRoom(obj);
        memberList = list;
    }
    const list = setFirstAvatr(memberList, name);
    return list;
}
async function generateAvatar(avatar) {
    let mc = new MCanvas({
        width: 880,
        height: 880,
        backgroundColor: '#ffffff',
    });
    mc.add(avatar, {
        width: 740,
        pos: {
            x: 70,
            y: 70,
            scale: 1,
        },
    });
    mc.add('http://image.xkboke.com/guajian', {
        width: 700,
        pos: {
            x: 90,
            y: -10,
            scale: 0.7,
        },
    });
    const base64 = await mc.draw({ type: 'jpg', quality: 1 });
    // var base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
    // var dataBuffer = Buffer.from(base64Data, 'base64')
    // fs.writeFile('avatar.jpg', dataBuffer, function (err) {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     console.log('保存成功！')
    //   }
    // })
    return base64;
}
export { getConstellation };
export { msgArr };
export { getAllSchedule };
export { generateRoomImg };
export { getRoomAvatar };
export { generateAvatar };
export default {
    getConstellation,
    msgArr,
    getAllSchedule,
    generateRoomImg,
    getRoomAvatar,
    generateAvatar
};
