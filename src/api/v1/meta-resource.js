import request from '@/utils/request'

var qs = require('querystringify')
var path = require('path')

export function postMetaResource(data) {
  const url = path.join('v1', 'meta-resources')
  return request({
    url,
    method: 'post',
    data: data
  })
}
/*
export function getMetaResource(id) {
  let query = []
  query['type'] = type

  const url = path.join(
    'v1',
    'meta-resources',
    id.toString() + qs.stringify(query, true)
  )
  return request({
    url,
    method: 'get'
  })
}*/
export function getMetaResources(
  meta_id,
  type,
  sort = '-created_at',
  search = '',
  page = 0,
  expand = ''
) {
  let query = []

  query['type'] = type
  query['meta_id'] = meta_id
  query['sort'] = sort
  query['expand'] = expand

  if (search !== '') {
    query['ResourceSearch[name]'] = search
  }
  if (page > 1) {
    query['page'] = page
  }

  const url = path.join(
    'v1',
    'meta-resources',
    'resources' + qs.stringify(query, true)
  )
  return request({
    url,
    method: 'get'
  })
}

export function putMetaResource(id, data) {
  const url = path.join('v1', 'meta-resources', id.toString())
  return request({
    url,
    method: 'put',
    data: data
  })
}
export function deleteMetaResource(id) {
  const url = path.join('v1', 'meta-resources', id.toString())
  return request({
    url,
    method: 'delete'
  })
}
