import request from '@/utils/request'

export function fetchContactList(query) {
  return request({
    url: '/contact/listContact',
    method: 'get',
    params: query
  })
}

export function syncContactList() {
  return request({
    url: '/contact/syncContact',
    method: 'post',
  })
}

export function fetchWelcome(id) {
  return request({
    url: '/contact/findWelcome',
    method: 'get',
    params: { id }
  })
}

export function updateWelcome(data) {
  return request({
    url: '/contact/updateWelcome',
    method: 'post',
    data
  })
}
