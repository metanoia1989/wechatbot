const cheerio = require('cheerio')
const path = require('path')
const { log, FileBox } = require('wechaty')

function make_mock_api(content) {
  return async function mock_func() {
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 1500);
      });
      return content
    } catch (error) {
      console.log(`获取${content}失败`, error)
    }
  }
}

module.exports = {
  getOne: make_mock_api("获取每日一句"), 
  getNews: make_mock_api("获取每日新闻内容"), 
  getMingYan: make_mock_api("获取名人名言"),
  getStar: make_mock_api("获取星座运势"),
  getTXweather: make_mock_api("获取天行天气"),
  getSweetWord: make_mock_api("土味情话获取"),
}


