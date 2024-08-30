import request from '@/utils/request'

var qs = require('querystringify')
var path = require('path')

export function postVerseMeta(data) {
  const url = path.join('v1', 'verse-metas')
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
export function getVerseMetas(
  verse_id,
  sort = '-created_at',
  search = '',
  page = 0,
  expand = ''
) {
  let query = []

  query['verse_id'] = verse_id
  query['sort'] = sort
  query['expand'] = expand

  if (search !== '') {
    query['MetaSearch[name]'] = search
  }
  if (page > 1) {
    query['page'] = page
  }

  const url = path.join(
    'v1',
    'verse-metas',
    'metas' + qs.stringify(query, true)
  )
  return request({
    url,
    method: 'get'
  })
}

export function putVerseMeta(id, data) {
  const url = path.join('v1', 'verse-metas', id.toString())
  return request({
    url,
    method: 'put',
    data: data
  })
}
export function deleteVerseMeta(id) {
  const url = path.join('v1', 'verse-metas', id.toString())
  return request({
    url,
    method: 'delete'
  })
}
