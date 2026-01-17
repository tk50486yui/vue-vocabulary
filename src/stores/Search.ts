import { Commit } from 'vuex'
interface SearchState {
  $searchShow: boolean
  $keyword: string
  $searchClass: string
  $filters: string[]
  $filtersCategoryId: number
  $filtersCategoryName: string
  $filtersTags: number[]
  $filtersTagsState: boolean
  $currentCateName: string
  $autoMove: string
  $isAutoMove: boolean
}

const state: SearchState = {
  $searchShow: true,
  $keyword: '',
  $searchClass: '',
  $filters: ['ws_name'],
  $filtersCategoryId: 0,
  $filtersCategoryName: '',
  $filtersTags: [],
  $filtersTagsState: false,
  $currentCateName: '',
  $autoMove: 'words',
  $isAutoMove: true
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
  updateFiltersCategory({ commit }: { commit: Commit }, payload: { id: number; name: string }) {
    commit('setFiltersCategory', payload)
  },
  updateFiltersTags({ commit }: { commit: Commit }, filtersTags: number[]) {
    commit('setFiltersTags', filtersTags)
  },
  pushFiltersTags({ commit }: { commit: Commit }, id: number) {
    commit('pushFiltersTags', id)
  }
}

const mutations = {
  setSearchShow(state: SearchState, searchShow: boolean) {
    state.$searchShow = searchShow
  },
  setKeyword(state: SearchState, keyword: string) {
    state.$keyword = keyword
  },
  setSearchClass(state: SearchState, searchClass: string) {
    state.$searchClass = searchClass
  },
  setFilters(state: SearchState, filters: string[]) {
    state.$filters = filters
  },
  setFiltersCategory(state: SearchState, payload: { id: number; name: string }) {
    state.$filtersCategoryId = payload.id
    state.$filtersCategoryName = payload.name
  },
  // This method is called from both 'Words' and 'Articles'
  async setFiltersTags(state: SearchState, filtersTags: number[]) {
    state.$filtersTags = filtersTags
    state.$filtersTagsState = false
  },
  // This method is only called from 'TagsMenu'
  async pushFiltersTags(state: SearchState, id: number) {
    // 0 => clear array
    if (id === 0) {
      state.$filtersTags.splice(0, state.$filtersTags.length)
    } else {
      if (state.$filtersTags.includes(id)) {
        const index = state.$filtersTags.indexOf(id)
        if (index !== -1) {
          state.$filtersTags.splice(index, 1)
        }
      } else {
        state.$filtersTags.push(id)
      }
    }

    state.$filtersTagsState = true // so that TagsMenu can watch it
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
