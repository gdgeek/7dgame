import request from '@/utils/request'

var qs = require('querystringify')
var path = require('path')
export function putUserData(data) {
  const url = path.join('v1', 'users', 'set-data')
  return request({
    url,
    method: 'put',
    data
  })
}
export function getUserCreation() {
  const query = {
    expand:
      'pictureCount,videoCount,polygenCount,postCount,likeCount, verseCount'
  }
  const url = path.join('v1', 'users', 'creation' + qs.stringify(query, true))
  return request({
    url,
    method: 'get'
  })
}

export function getTest() {
  const url = path.join('v1', 'uploads', 'file')

  return request({
    url,
    method: 'post'
  })
}
export function getUserData(token) {
  return request({
    url: 'v1/users/get-data',
    method: 'get',
    params: { token }
  })
}
