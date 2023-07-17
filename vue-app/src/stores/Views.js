const state = {
  $WordsGroupsView: {
    groupArray: [],
    update: false
  },
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
  },
  updateWordsGroupsView ({ commit }, { variable, data }) {
    if (variable === 'groupArray') {
      commit('setWordsGroupsView', { variable, data })
    }
  }
}

const mutations = {
  setWordsGrid (state, { variable, data }) {
    state.$WordsGrid[variable] = data
  },
  setArticlesView (state, { variable, data }) {
    state.$ArticlesView[variable] = data
  },
  setWordsGroupsView (state, { variable, data }) {
    if (data.clear && data.clear === true) {
      state.$WordsGroupsView[variable] = []
    } else {
      if (data.checked === true) {
        state.$WordsGroupsView[variable].push(data)
      } else {
        const index = state.$WordsGroupsView[variable].findIndex(
          (item) => item.ws_id === data.ws_id
        )
        if (index !== -1) {
          state.$WordsGroupsView[variable].splice(index, 1)
        }
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
