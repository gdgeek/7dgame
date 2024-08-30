import request from '@/utils/request'

var qs = require('querystringify')
var path = require('path')

export function postVerseScript(data) {
  const url = path.join('v1', 'verse-scripts')
  return request({
    url,
    method: 'post',
    data: data
  })
}
export function putVerseScript(id, data) {
  const url = path.join('v1', 'verse-scripts', id.toString())
  return request({
    url,
    method: 'put',
    data
  })
}
export function getVerseScript(id, expand = '') {
  let query = []

  query['expand'] = expand
  const url = path.join(
    'v1',
    'verse-scripts',
    id.toString() + qs.stringify(query, true)
  )

  return request({
    url,
    method: 'get'
  })
}
export function getVerseScripts(verse_id, expand = '') {
  let query = []

  query['verse_id'] = verse_id
  //query['sort'] = sort
  query['expand'] = expand

  const url = path.join('v1', 'verse-scripts' + qs.stringify(query, true))

  return request({
    url,
    method: 'get'
  })
}

export function delVerseScripts(id) {
  const url = path.join('v1', 'verse-scripts', id.toString())
  return request({
    url,
    method: 'delete'
  })
}
/**/
