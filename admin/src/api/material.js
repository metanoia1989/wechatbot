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

export function fetchRoomList(query) {
  return request({
    url: '/group/listRoom',
    method: 'get',
    params: query
  })
}

export function syncRoomList() {
  return request({
    url: '/group/syncRoom',
    method: 'post',
  })
}

export function fetchLibraryList(query) {
  return request({
    url: '/group/listLibrary',
    method: 'get',
    params: query
  })
}

export function relateRoomLibrary(data) {
  return request({
    url: '/group/relateRoomLibrary',
    method: 'post',
    data,
  })
}