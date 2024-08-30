import request from '@/utils/request'

var qs = require('querystringify')
var path = require('path')

export function postVerseKnight(data) {
  const url = path.join('v1', 'verse-knights')
  return request({
    url,
    method: 'post',
    data: data
  })
}

export function getVerseKnights(
  verse_id,
  sort = '-created_at',
  search = '',
  page = 0,
  expand = ''
) {
  let query = []
  query['expand'] = expand
  query['verse_id'] = verse_id
  query['sort'] = sort

  if (search !== '') {
    query['KnightSearch[title]'] = search
  }
  if (page > 1) {
    query['page'] = page
  }

  const url = path.join(
    'v1',
    'verse-knights',
    'knights' + qs.stringify(query, true)
  )
  return request({
    url,
    method: 'get'
  })
}
/*
export function putVerseKnight(id, data) {
  const url = path.join('v1', 'verse-knights', id.toString())
  return request({
    url,
    method: 'put',
    data: data
  })
}*/
export function deleteVerseKnight(id) {
  const url = path.join('v1', 'verse-knights', id.toString())
  return request({
    url,
    method: 'delete'
  })
}
