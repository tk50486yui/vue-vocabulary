import { Commit } from 'vuex'
interface ThemeState {
  $theme: string
}

const state: ThemeState = {
  $theme: 'dark'
}

const actions = {
  updateTheme({ commit }: { commit: Commit }, theme: string) {
    if (theme !== 'dark' && theme !== 'light') {
      theme = 'dark'
    }
    commit('setTheme', theme)
  }
}

const mutations = {
  setTheme(state: ThemeState, theme: string) {
    state.$theme = theme
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
