import request from '@/utils/request'

export function fetchWelcomeList(query) {
  return request({
    url: '/group/listWelcome',
    method: 'get',
    params: query
  })
}

export function fetchWelcome(id) {
  return request({
    url: '/group/findWelcome',
    method: 'get',
    params: { id }
  })
}

export function createWelcome(data) {
  return request({
    url: '/group/saveWelcome',
    method: 'post',
    data
  })
}

export function updateWelcome(data) {
  return request({
    url: '/group/updateWelcome',
    method: 'post',
    data
  })
}

export function deleteWelcome(id) {
  return request({
    url: '/group/deleteWelcome',
    method: 'post',
    data: { id } 
  })
}
