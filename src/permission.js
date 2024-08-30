import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie

import { ready } from '@/api/v1/local'
import env from '@/environment.js'
import { AbilityRouter } from '@/ability/ability'
import ability from './ability'
NProgress.configure({ showSpinner: false }) // NProgress Configuration
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  const token = getToken()
  const hasGetUserInfo = store.getters.userData !== null

  if (token !== null && !hasGetUserInfo) {
    if (!ability.can('goto', new AbilityRouter(to.path))) {
      await store.dispatch('user/getUser')
    }
  }
  // set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${store.state.information.data.title}`
  } else {
    document.title = `${store.state.information.data.title}`
  }
  if (env.canSetup() && !to.path.includes('setup')) {
    const response = await ready()
    const data = response.data
    if (!data.result) {
      next(`/setup/index`)
      NProgress.done()
      return
    }
  }
  if (ability.can('goto', new AbilityRouter(to.path))) {
    next()
    NProgress.done()
  } else {
    if (env.canWeb()) {
      next(`/web`)
    } else if (env.canBlog()) {
      next(`/blog`)
    } else {
      next(`/site`)
    }
    NProgress.done()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
