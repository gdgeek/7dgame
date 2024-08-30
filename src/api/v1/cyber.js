import request from '@/utils/request'
export function postCyber(data) {
  return request({
    url: 'v1/cybers',
    method: 'post',
    data: data
  })
}

export function getCyber(id) {
  return request({
    url: 'v1/cybers/' + id,
    method: 'get'
  })
}

export function putCyber(id, data) {
  return request({
    url: 'v1/cybers/' + id,
    method: 'put',
    data
  })
}
export function deleteCyber(id) {
  return request({
    url: 'v1/cybers/' + id,
    method: 'delete'
  })
}
