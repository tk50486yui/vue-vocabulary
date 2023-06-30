const state = {
  $WordsGrid: {
    currentPage: '1',
    jumpPage: false,
    currentScrollY: 100,
    jumpScroll: false
  }
}

const actions = {
  updateWordsGrid ({ commit }, { variable, data }) {
    commit('setWordsGrid', { variable, data })
  }
}

const mutations = {
  setWordsGrid (state, { variable, data }) {
    state.$WordsGrid[variable] = data
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
