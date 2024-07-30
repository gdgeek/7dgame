import request from '@/utils/request'

var qs = require('querystringify')
var path = require('path')
export function postVpMap(data) {
  return request({
    url: 'v1/vp-maps',
    method: 'post',
    data: data
  })
}
export function deleteVpMap(id) {
  return request({
    url: 'v1/vp-maps/' + id,
    method: 'delete'
  })
}
export function getVpMaps(page = 1) {


  let query = []
  if (page > 1) {
    query['page'] = page
  }
  return request({
    url: path.join('v1', 'vp-maps' + qs.stringify(query, true)),
    method: 'get'
  })

}
