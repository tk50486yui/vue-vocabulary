const state = {
  $searchShow: false,
  $keyword: '',
  $searchClass: '',
  $filters: ['ws_name'],
  $filtersTags: [],
  $filtersTagsState: false
}

const actions = {
  updateSearchShow({ commit }, searchShow) {
    commit('setSearchShow', searchShow)
  },
  updateKeyword({ commit }, keyword) {
    commit('setKeyword', keyword)
  },
  updateSearchClass({ commit }, searchClass) {
    commit('setSearchClass', searchClass)
  },
  updateFilters({ commit }, filters) {
    commit('setFilters', filters)
  },
  updateFiltersTags({ commit }, filters) {
    commit('setFiltersTags', filters)
  },
  pushFiltersTags({ commit }, filters) {
    commit('pushFiltersTags', filters)
  }
}

const mutations = {
  setSearchShow(state, searchShow) {
    state.$searchShow = searchShow
  },
  setKeyword(state, keyword) {
    state.$keyword = keyword
  },
  setSearchClass(state, searchClass) {
    state.$searchClass = searchClass
  },
  setFilters(state, filters) {
    state.$filters = filters
  },
  async setFiltersTags(state, filtersTags) {
    state.$filtersTags = filtersTags
    state.$filtersTagsState = false // 不是在 menu 設定的
  },
  async pushFiltersTags(state, id) {
    if (state.$filtersTags.includes(id)) {
      const index = state.$filtersTags.indexOf(id)
      if (index !== -1) {
        state.$filtersTags.splice(index, 1)
      }
    } else {
      state.$filtersTags.push(id)
    }
    state.$filtersTagsState = true // 是在 menu 設定的
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
