import request from '@/utils/request'
export function postMessage(data) {
  return request({
    url: 'v1/messages',
    method: 'post',
    data: data
  })
}

export function getMessage(id) {
  return request({
    url:
      'v1/messages/' +
      id +
      '?expand=messageTags,replies,author,like,likesCount',
    method: 'get'
  })
}

export function getMessages(
  sort = '-created_at',
  search = null,
  page = 0,
  tag = NaN
) {
  let url = 'v1/messages?expand=author,messageTags&sort=' + sort
  if (!isNaN(tag)) {
    url += '&tag=' + tag
  }
  if (search) {
    url += '&MessageSearch[title]=' + search
  }
  if (page > 1) {
    url += '&page=' + page
  }

  return request({
    url,
    method: 'get'
  })
}
export function getMessagesWithAuthor(
  author_id,
  sort = '-created_at',
  search = null,
  page = 0
) {
  let url = 'v1/messages?expand=author,messageTags&sort=' + sort
  if (!isNaN(author_id)) {
    url += '&MessageSearch[author_id]=' + author_id
  }
  if (search) {
    url += '&MessageSearch[title]=' + search
  }

  if (page > 1) {
    url += '&page=' + page
  }

  return request({
    url,
    method: 'get'
  })
}
export function putMessage(id, data) {
  return request({
    url: 'v1/messages/' + id,
    method: 'put',
    data: data
  })
}
export function deleteMessage(id) {
  return request({
    url: 'v1/messages/' + id,
    method: 'delete'
  })
}
