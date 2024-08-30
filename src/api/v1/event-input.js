import request from '@/utils/request'

var qs = require('querystringify')
var path = require('path')

export function postEventInput(data) {
  const url = path.join('v1', 'event-inputs')
  return request({
    url,
    method: 'post',
    data
  })
}

export function deleteEventInput(id) {
  const url = path.join('v1', 'event-inputs', id.toString())
  return request({
    url,
    method: 'delete'
  })
}
