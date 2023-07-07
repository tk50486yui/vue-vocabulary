const state = {
  $WordsGrid: {
    currentPage: '1',
    jumpPage: false,
    currentScrollY: 100,
    jumpScroll: false,
    currentPageSize: 20
  },
  $ArticlesView: {
    currentPage: '1',
    jumpPage: false,
    currentScrollY: 100,
    jumpScroll: false,
    currentPageSize: 20
  }
}

const actions = {
  updateWordsGrid ({ commit }, { variable, data }) {
    commit('setWordsGrid', { variable, data })
  },
  updateArticlesView ({ commit }, { variable, data }) {
    commit('setArticlesView', { variable, data })
  }
}

const mutations = {
  setWordsGrid (state, { variable, data }) {
    state.$WordsGrid[variable] = data
  },
  setArticlesView (state, { variable, data }) {
    state.$ArticlesView[variable] = data
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
