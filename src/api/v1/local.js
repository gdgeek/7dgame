import request from '@/utils/request'
var qs = require('querystringify')
var path = require('path')

export function information() {
  return request({
    url: 'v1/locals/information',
    method: 'get'
  })
}

export function ready() {
  return request({
    url: 'v1/locals/ready',
    method: 'get'
  })
}

export function init(data) {
  return request({
    url: 'v1/locals/init',
    method: 'post',
    data
  })
}
