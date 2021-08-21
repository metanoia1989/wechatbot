import request from '@/utils/request'

export function fetchKeywordList(query) {
  return request({
    url: '/keyword/listKeyword',
    method: 'get',
    params: query
  })
}

export function fetchKeyword(id) {
  return request({
    url: '/keyword/findKeyword',
    method: 'get',
    params: { id }
  })
}

export function createKeyword(data) {
  return request({
    url: '/keyword/saveKeyword',
    method: 'post',
    data
  })
}

export function updateKeyword(data) {
  return request({
    url: '/keyword/updateKeyword',
    method: 'post',
    data
  })
}

export function deleteKeyword(id) {
  return request({
    url: '/keyword/deleteKeyword',
    method: 'post',
    data: { id } 
  })
}
