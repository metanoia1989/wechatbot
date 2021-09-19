import request from '@/utils/request'

export function fetchQrcode() {
  return request({
    url: '/wechat/qrcode',
    method: 'get',
  })
}

export function loginStatus() {
  return request({
    url: '/wechat/loginStatus',
    method: 'get',
  })
}


export function clearRedisCache() {
  return request({
    url: '/wechat/clearRedisCache',
    method: 'post',
  })
}

