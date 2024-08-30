import request from '@/utils/request'
export function postVerseCyber(data) {
  return request({
    url: 'v1/verse-cybers',
    method: 'post',
    data: data
  })
}

export function getVerseCyber(id) {
  return request({
    url: 'v1/verse-cybers/' + id,
    method: 'get'
  })
}

export function getVerseCybers(sort = '-created_at', search = '', page = 0) {
  let url = 'v1/verse-cybers?expand=author&sort=' + sort

  if (search !== '') {
    url += '&VerseSearch[name]=' + search
  }
  if (page > 1) {
    url += '&page=' + page
  }

  return request({
    url,
    method: 'get'
  })
}

export function putVerseCyber(id, data) {
  return request({
    url: 'v1/verse-cybers/' + id,
    method: 'put',
    data
  })
}
export function deleteVerseCyber(id) {
  return request({
    url: 'v1/verse-cybers/' + id,
    method: 'delete'
  })
}
