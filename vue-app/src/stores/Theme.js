const state = {
  $theme: 'dark'
}

const actions = {
  updateTheme ({ commit }, theme) {
    if (theme !== 'dark' && theme !== 'light') {
      theme = 'dark'
    }
    commit('setTheme', theme)
  }
}

const mutations = {
  setTheme (state, theme) {
    state.$theme = theme
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
