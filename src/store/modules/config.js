import cloud from '@/assets/js/file/tencent-cloud.js'
import server from '@/assets/js/file/server.js'

import env from '@/environment.js'
const state = {
  store: (() => {
    if (env.useCloud()) {
      return cloud
    } else {
      return server
    }
  })()
}

export default {
  namespaced: true,
  state
}
