function fetchContactType(contactPayload) {
    let id = contactPayload.id 
    if (id.startsWith("gh_")) {
        return 'official'
    } 
    return 'personal'
}

/**
 * 提取微信号
 * @param {Object} contactPayload 
 * @returns string
 */
function fetchWeixin(contactPayload) {
    let weixin = contactPayload.alias
    let id = contactPayload.id
    if (!weixin && !id.startsWith("gh_") && !id.startsWith("wxid_")) {
        weixin = id
    }
    return weixin
}

module.exports = {
    fetchContactType,
    fetchWeixin
}