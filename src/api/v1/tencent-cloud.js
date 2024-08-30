import request from '@/utils/request'

var qs = require('querystringify')
var path = require('path')
export function token(bucket, region = 'ap-nanjing') {
  const url = path.join(
    'v1',
    'tencent-clouds',
    'token' + qs.stringify({ bucket, region }, true)
  )
  return request({
    url,
    method: 'get'
  })
}

export function store() {
  const url = path.join('v1', 'tencent-clouds', 'store')
  return request({
    url,
    method: 'get'
  })
}

export function cloud() {
  const url = path.join('v1', 'tencent-clouds', 'cloud')
  return request({
    url,
    method: 'get'
  })
}
