import { Commit } from 'vuex'
interface RootState {
  $searchShow: boolean
  $keyword: string
  $searchClass: string
  $filters: string[]
  $filtersTags: number[]
  $filtersTagsState: boolean
}

const state: RootState = {
  $searchShow: false,
  $keyword: '',
  $searchClass: '',
  $filters: ['ws_name'],
  $filtersTags: [],
  $filtersTagsState: false
}

const actions = {
  updateSearchShow({ commit }: { commit: Commit }, searchShow: boolean) {
    commit('setSearchShow', searchShow)
  },
  updateKeyword({ commit }: { commit: Commit }, keyword: string) {
    commit('setKeyword', keyword)
  },
  updateSearchClass({ commit }: { commit: Commit }, searchClass: string) {
    commit('setSearchClass', searchClass)
  },
  updateFilters({ commit }: { commit: Commit }, filters: string[]) {
    commit('setFilters', filters)
  },
  updateFiltersTags({ commit }: { commit: Commit }, filtersTags: number[]) {
    commit('setFiltersTags', filtersTags)
  },
  pushFiltersTags({ commit }: { commit: Commit }, filtersTags: number[]) {
    commit('pushFiltersTags', filtersTags)
  }
}

const mutations = {
  setSearchShow(state: RootState, searchShow: boolean) {
    state.$searchShow = searchShow
  },
  setKeyword(state: RootState, keyword: string) {
    state.$keyword = keyword
  },
  setSearchClass(state: RootState, searchClass: string) {
    state.$searchClass = searchClass
  },
  setFilters(state: RootState, filters: string[]) {
    state.$filters = filters
  },
  async setFiltersTags(state: RootState, filtersTags: number[]) {
    state.$filtersTags = filtersTags
    state.$filtersTagsState = false // 不是在 menu 設定的
  },
  async pushFiltersTags(state: RootState, id: number) {
    if (state.$filtersTags.includes(id)) {
      const index = state.$filtersTags.indexOf(id)
      if (index !== -1) {
        state.$filtersTags.splice(index, 1)
      }
    } else {
      state.$filtersTags.push(id)
    }
    state.$filtersTagsState = true // 只在 menu 設定
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
