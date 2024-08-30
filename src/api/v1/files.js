import request from '@/utils/request'
var qs = require('querystringify')
var path = require('path')

export function postFile(data) {
  const url = path.join('v1', 'files')


  return request({
    url,
    method: 'post',
    data
  })
}
