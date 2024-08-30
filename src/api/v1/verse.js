import request from '@/utils/request'

import { v4 as uuidv4 } from 'uuid'
import environment from '@/environment.js'
var qs = require('querystringify')
var path = require('path')

export function postVerse(data) {
  data.version = environment.version
  data.uuid = data.uuid || uuidv4()
  return request({
    url: path.join('v1', 'verses'),
    method: 'post',
    data
  })
}

export function getVerse(id, expand = 'metas,share') {
  return request({
    url: path.join(
      'v1',
      'verses',
      id.toString() + qs.stringify({ expand: expand }, true)
    ),
    method: 'get'
  })
}
export function putVerseCode(id, data) {
  return request({
    url: path.join('v1', 'verses', 'code' + qs.stringify({ id }, true)),
    method: 'put',
    data
  })
}

export function getVersesWithShare(
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
    url: path.join('v1', 'verses', 'share' + qs.stringify(query, true)),
    method: 'get'
  })
}

export function getVersesWithOpen(
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
    url: path.join('v1', 'verses', 'open' + qs.stringify(query, true)),
    method: 'get'
  })
}

export function getVerses(
  sort = '-created_at',
  search = '',
  page = 0,
  expand = 'image,author,share',
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
    url: path.join('v1', 'verses' + qs.stringify(query, true)),
    method: 'get'
  })
}

export function putVerse(id, data) {

  data.version = environment.version
  return request({
    url: path.join('v1', 'verses', id.toString()),
    method: 'put',
    data
  })
}
export function deleteVerse(id) {
  return request({
    url: path.join('v1', 'verses', id.toString()),
    method: 'delete'
  })
}
