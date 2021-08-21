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
  keywordEventList:  {
    "query-lib-donate": "查询分馆募捐数据",
    "query-lib-borrow": "查询借阅数据" ,
    "fetch-room-invite": "获取微澜群组邀请",
  }

}
