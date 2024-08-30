import env from '@/environment.js'
function companies() {
  if (document.domain.toLowerCase().indexOf('u7gm.com') >= 0) {
    return [{ name: '上海游七网络科技有限公司', url: 'https://u7gm.com' }]
  }
  return [{ name: '上海不加班网络科技有限公司', url: 'https://bujiaban.com' }]
}

const state = {
  data: {
    title: env.title(),
    description: env.subtitle(),
    companies: companies(),
    version: '20230412.1',
    beian: '沪ICP备15039333号',
    logo: '/media/image/logo.gif'
  }
}

const mutations = {
  setData(state, data) {
    state.data = data
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
