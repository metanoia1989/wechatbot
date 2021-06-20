import request from '@/utils/request'

export function fetchFileList(query) {
  return request({
    url: '/file/listFile',
    method: 'get',
    params: query
  })
}

export function fetchFile(id) {
  return request({
    url: '/file/findFile',
    method: 'get',
    params: { id }
  })
}

export function createFile(data) {
  return request({
    url: '/file/saveFile',
    method: 'post',
    data
  })
}

export function updateFile(data) {
  return request({
    url: '/file/updateFile',
    method: 'post',
    data
  })
}

export function deleteFile(id) {
  return request({
    url: '/file/deleteFile',
    method: 'post',
    data: { id } 
  })
}
