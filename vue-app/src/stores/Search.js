const state = {
  $keyword: '',
  $searchClass: '',
  $filters: ['ws_name'],
  $filtersTags: []
}

const actions = {
  updateKeyword ({ commit }, keyword) {
    commit('setKeyword', keyword)
  },
  updateSearchClass ({ commit }, searchClass) {
    commit('setSearchClass', searchClass)
  },
  updateFilters ({ commit }, filters) {
    commit('setFilters', filters)
  },
  updateFiltersTags ({ commit }, filters) {
    commit('setFiltersTags', filters)
  }
}

const mutations = {
  setKeyword (state, keyword) {
    state.$keyword = keyword
  },
  setSearchClass (state, searchClass) {
    state.$searchClass = searchClass
  },
  setFilters (state, filters) {
    state.$filters = filters
  },
  setFiltersTags (state, filtersTags) {
    state.$filtersTags = filtersTags
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
