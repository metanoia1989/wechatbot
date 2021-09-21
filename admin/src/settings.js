module.exports = {

  title: '微信Bot管理后台',

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * 关键词页面数据
   */
  keywordTypes: {
    1: "普通关键词",
    2: "事件关键词",
    3: "入群关键词",
  },
  keywordScopes: {
    'all': "全部",
    'group': "仅群组",
    'personal': "仅个人",
  },
  keywordEventList:  {
    "query-lib-donate": "查询分馆募捐数据",
    "query-lib-borrow": "查询借阅数据" ,
    "fetch-room-invite": "获取微澜群组邀请",
    "set-group-welcome": "设置群组欢迎语",
    "reting-record-stats": "借阅统计图表",
  }

}
