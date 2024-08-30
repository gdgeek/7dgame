import request from '@/utils/request'
var qs = require('querystringify')
var path = require('path')

export function getVerseOpenVerses(
  sort = '-created_at',
  search = '',
  page = 0,
  expand = 'image,author'
) {
  let query = []
  query['expand'] = expand
  query['sort'] = sort

  if (search !== '') {
    query['VerseSearch[name]'] = search
  }
  if (page > 1) {
    query['page'] = page
  }

  return request({
    url: path.join('v1', 'verse-opens', 'verses' + qs.stringify(query, true)),
    method: 'get'
  })
}
export function postVerseOpen(data) {
  return request({
    url: 'v1/verse-opens',
    method: 'post',
    data
  })
}
export function deleteVerseOpen(id) {
  return request({
    url: 'v1/verse-opens/' + id,
    method: 'delete'
  })
}
