const state = {
  $WordsGrid: {
    currentPage: '1',
    jumpPage: false,
    currentScrollY: 100,
    jumpScroll: false,
    currentPageSize: 20,
    filterItemsState: {
      choiceArray: [],
      choiceOperator: 'or',
      tagsOperator: 'or'
    },
    isItemsState: {
      isPronunciation: true,
      isDefinition: true,
      isSlogan: false,
      isCate: false,
      isTag: true
    }
  },
  $ArticlesView: {
    currentPage: '1',
    jumpPage: false,
    currentScrollY: 100,
    jumpScroll: false,
    currentPageSize: 20
  },
  $WordsGroupsView: {
    groupArray: [],
    wg_name: '',
    id: ''
  },
  $WordsGroupsDetailsView: {
    updateNow: false
  }
}

const actions = {
  updateWordsGrid({ commit }, { variable, data }) {
    commit('setWordsGrid', { variable, data })
  },
  updateArticlesView({ commit }, { variable, data }) {
    commit('setArticlesView', { variable, data })
  },
  updateWordsGroupsView({ commit }, { variable, data }) {
    if (variable === 'groupArray') {
      commit('setWordsGroupsView', { variable, data })
    } else if (variable === 'wg_name') {
      state.$WordsGroupsView.wg_name = data
    } else if (variable === 'id') {
      state.$WordsGroupsView.id = data
    }
  },
  updateWordsGroupsDetailsView({ commit }, { variable, data }) {
    if (variable === 'updateNow') {
      commit('setWordsGroupsDetailsView', { variable, data })
    }
  }
}

const mutations = {
  setWordsGrid(state, { variable, data }) {
    state.$WordsGrid[variable] = data
  },
  setArticlesView(state, { variable, data }) {
    state.$ArticlesView[variable] = data
  },
  setWordsGroupsView(state, { variable, data }) {
    if (data.clear && data.clear === true) {
      state.$WordsGroupsView[variable] = []
      state.$WordsGroupsView.wg_name = ''
      state.$WordsGroupsView.id = ''
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
  },
  setWordsGroupsDetailsView(state, { variable, data }) {
    state.$WordsGroupsDetailsView[variable] = data
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
