import request from '@/utils/request'
import silent from '@/utils/silent_request'

var qs = require('querystringify')
var path = require('path')

export function postEventLink(data) {
  const url = path.join('v1', 'event-links')
  return request({
    url,
    method: 'post',
    data
  })
}

function getEventLink(id) {
  const url = path.join('v1', 'event-links', id.toString())

  return request({
    url,
    method: 'get'
  })
}
function headEventLink(id) {
  const url = path.join('v1', 'event-links', id.toString())

  return silent({
    url,
    method: 'head'
  })
}
function deleteEventLink(id) {
  const url = path.join('v1', 'event-links', id.toString())
  return request({
    url,
    method: 'delete'
  })
}

export function testDelEventLink(id) {
  return new Promise(async (resolve, reject) => {
    try {
      await headEventLink(id)
      const response = await deleteEventLink(id)
      resolve(response)
    } catch (error) {
      console.log('error')
      console.log(error)
      reject(resolve)
    }
  })
}
