import request from '@/utils/request'

var qs = require('querystringify')
var path = require('path')

export function uploadFile(data) {
  return request({
    url: path.join('v1', 'uploads', 'file'),
    method: 'post',
    data
  })
}
