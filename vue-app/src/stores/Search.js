const state = {
  $keyword: ''
}

const actions = {
  updateKeyword ({ commit }, keyword) {
    commit('setKeyword', keyword)
  }
}

const mutations = {
  setKeyword (state, keyword) {
    state.$keyword = keyword
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
