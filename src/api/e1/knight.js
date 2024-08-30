import request from '@/utils/request'

var qs = require('querystringify')
var path = require('path')

export function getKnight(id, expand = 'resources') {
  const url = path.join(
    'e1',
    'knights',
    id.toString() + qs.stringify({ expand: expand }, true)
  )
  return request({
    url,
    method: 'get'
  })
}
