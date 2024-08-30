import request from '@/utils/request'

var qs = require('querystringify')
var path = require('path')

export function postVerseSpace(data) {
  const url = path.join('v1', 'verse-spaces')
  return request({
    url,
    method: 'post',
    data: data
  })
}

export function getVerseSpaces(
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
    query['SpaceSearch[name]'] = search
  }
  if (page > 1) {
    query['page'] = page
  }

  const url = path.join(
    'v1',
    'verse-spaces',
    'spaces' + qs.stringify(query, true)
  )
  return request({
    url,
    method: 'get'
  })
}
/*
export function putVerseSpace(id, data) {
  const url = path.join('v1', 'verse-spaces', id.toString())
  return request({
    url,
    method: 'put',
    data: data
  })
}*/
export function deleteVerseSpace(id) {
  const url = path.join('v1', 'verse-spaces', id.toString())
  return request({
    url,
    method: 'delete'
  })
}
