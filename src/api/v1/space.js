import request from '@/utils/request'
import path from 'path'
import url from 'url'

export function postSpace(data) {
  return request({
    url: '/v1/spaces',
    method: 'post',
    data
  })
}
export async function getSpaces(
  sort = '-created_at',
  search = null,
  page = 0,
  expand = 'image, author'
) {
  return new Promise(async function (resolve, reject) {
    try {
      let query = {
        expand,
        sort
      }
      if (search !== null) {
        query['SpaceSearch[title]'] = search
      }
      if (page > 1) {
        query['page'] = page
      }
      const response = await request({
        url: url.format({
          pathname: '/v1/spaces',
          query
        }),
        method: 'get'
      })
      //  console.error(response)
      resolve(response)
    } catch (err) {
      reject(err)
    }
  })
}
export function getSpace(id, query = {}) {
  return request({
    url: url.format({
      pathname: path.join('/v1/spaces', id.toString()),
      query
    }),
    method: 'get'
  })
}

export function deleteSpace(id) {
  return request({
    url: path.join('/v1/spaces', id.toString()),
    method: 'delete'
  })
}
export function putSpace(id, data) {
  return request({
    url: path.join('/v1/spaces', id.toString()),
    method: 'put',
    data
  })
}
