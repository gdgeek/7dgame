import request from '@/utils/request'

var qs = require('querystringify')
var path = require('path')

export function putVerseShare(id, data) {
  const url = path.join('v1', 'verse-shares', id.toString())

  return request({
    url,
    method: 'put',
    data
  })
}

export function postVerseShare(data) {
  const url = path.join('v1', 'verse-shares')
  return request({
    url,
    method: 'post',
    data
  })
}

export function getVerseShareVerses(
  sort = '-created_at',
  search = '',
  page = 0,
  expand = 'image,author,share'
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
    url: path.join('v1', 'verse-shares', 'verses' + qs.stringify(query, true)),
    method: 'get'
  })
}

export function getVerseShares(verseId) {
  let query = []
  query['verse_id'] = verseId
  const url = path.join('v1', 'verse-shares' + qs.stringify(query, true))
  return request({
    url,
    method: 'get'
  })
}
export function deleteVerseShare(id) {
  return request({
    url: 'v1/verse-shares/' + id,
    method: 'delete'
  })
}
