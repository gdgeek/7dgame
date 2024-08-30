import request from '@/utils/request'

var qs = require('querystringify')
var path = require('path')

export function postEventOutput(data) {
  const url = path.join('v1', 'event-outputs')

  return request({
    url,
    method: 'post',
    data
  })
}

export function deleteEventOutput(id) {
  const url = path.join('v1', 'event-outputs', id.toString())
  return request({
    url,
    method: 'delete'
  })
}
