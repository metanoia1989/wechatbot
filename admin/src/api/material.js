import request from '@/utils/request'

export function fetchMaterialList(query) {
  return request({
    url: '/material/listMaterial',
    method: 'get',
    params: query
  })
}

export function fetchMaterial(id) {
  return request({
    url: '/material/findMaterial',
    method: 'get',
    params: { id }
  })
}

export function createMaterial(data) {
  return request({
    url: '/material/saveMaterial',
    method: 'post',
    data
  })
}

export function updateMaterial(data) {
  return request({
    url: '/material/updateMaterial',
    method: 'post',
    data
  })
}

export function deleteMaterial(id) {
  return request({
    url: '/material/deleteMaterial',
    method: 'post',
    data: { id } 
  })
}
