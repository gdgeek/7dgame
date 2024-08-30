const state = {
  list: []
}

const mutations = {
  setBreadcrumbs(state, { list }) {
    state.list = list
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
