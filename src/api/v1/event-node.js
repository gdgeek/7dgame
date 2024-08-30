import request from '@/utils/request'

var qs = require('querystringify')
var path = require('path')

export function getEventNodeByMetaId(metaId) {
  return request({
    url: path.join(
      'v1',
      'event-nodes' + qs.stringify({ meta_id: metaId }, true)
    ),
    method: 'get'
  })
}
