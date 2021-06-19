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