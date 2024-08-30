import request from '@/utils/request'
var qs = require('querystringify')
var path = require('path')
export function getMenu() {
  return request({
    url: '/servers/menu',
    method: 'get'
  })
}
export function getData(token) {
  return request({
    url: '/servers/user',
    method: 'get',
    params: { token }
  })
}
export function logout() {
  return request({
    url: '/servers/logout',
    method: 'get'
  })
}
export function sts(bucket, region) {
  const url = path.join(
    'servers',
    'sts' + qs.stringify({ bucket, region }, true)
  )
  return request({
    url,
    method: 'get'
  })
}
export function store() {
  return request({
    url: '/servers/store',
    method: 'get'
  })
}
export function token() {
  return request({
    url: '/servers/token',
    method: 'get'
  })
}

export function bindEmail(email) {
  return request({
    url: '/servers/bind-email',
    method: 'post',
    data: { email }
  })
}

export function resetPassword(oldPassword, password) {
  return request({
    url: '/servers/reset-password',
    method: 'post',
    data: { oldPassword, password }
  })
}
