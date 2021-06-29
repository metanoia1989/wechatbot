/**
 * 自定义事件列表，用于关键词回复
 */
const EventList = [
    { key: "query-lib-donate", title: "查询分馆募捐数据" },
    { key: "query-lib-borrow", title: "查询借阅数据" },
    { key: "fetch-room-invite", title: "获取微澜群组邀请" },
]

var EventObj = {}

EventList.forEach(item => EventObj[item.key] = item.title )


module.exports = {
    EventList,
    EventObj
}