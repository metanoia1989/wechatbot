import request from '@/utils/request'


export function fetchFileList(query) {
  return request({
    url: '/file/listFile',
    method: 'get',
    params: query
  })
}

export function fetchAllFile() {
  return request({
    url: '/file/allFile',
    method: 'get',
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
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data,
  })
}

export function updateFile(data) {
  return request({
    url: '/file/updateFile',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data,
  })
}

export function deleteFile(id) {
  return request({
    url: '/file/deleteFile',
    method: 'post',
    data: { id } 
  })
}
