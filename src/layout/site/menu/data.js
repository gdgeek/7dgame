export let data = []

import env from '@/environment.js'

if (env.canWeb()) {
  data = [
    {
      path: '/web/index',
      name: 'Index',
      text: '平台入口'
    },
    {
      path: '/web/education',
      name: 'Education',
      text: '智能教育'
    },
    {
      path: '/web/exhibition',
      name: 'Exhibition',
      text: '全息展馆'
    },
    {
      path: '/web/sandtable',
      name: 'SandTable',
      text: '展会沙盘'
    },
    {
      path: '/web/medical',
      name: 'Medical',
      text: '元宇宙医疗'
    }
  ]
} else {
  data = [
    {
      path: '/blog/index',
      name: 'Index',
      text: '开发博客'
    }
  ]
}
export default { data }
