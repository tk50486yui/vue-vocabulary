import { Commit } from 'vuex'
interface RootState {
  $theme: string
}

const state: RootState = {
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
  setTheme(state: RootState, theme: string) {
    state.$theme = theme
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
