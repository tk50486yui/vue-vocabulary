import { Commit } from 'vuex'
import { groupArray } from '@/interfaces/WordsGroups'
import {
  ViewsState,
  WordsGridType,
  ArticlesViewType,
  WordsGroupsViewType,
  WordsGroupsDetailsViewType
} from '@/interfaces/ViewsType'

const state: ViewsState = {
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
    groupArray: [] as groupArray[],
    wg_name: '',
    id: null,
    clear: false,
    checked: false
  },
  $WordsGroupsDetailsView: {
    updateNow: false
  }
}

const actions = {
  updateWordsGrid(
    { commit }: { commit: Commit },
    { variable, data }: WordsGridType
  ) {
    commit('setWordsGrid', { variable, data })
  },
  updateArticlesView(
    { commit }: { commit: Commit },
    { variable, data }: ArticlesViewType
  ) {
    commit('setArticlesView', { variable, data })
  },
  updateWordsGroupsView(
    { commit }: { commit: Commit },
    { variable, data }: WordsGroupsViewType
  ) {
    commit('setWordsGroupsView', { variable, data })
  },
  updateWordsGroupsDetailsView(
    { commit }: { commit: Commit },
    { variable, data }: WordsGroupsDetailsViewType
  ) {
    commit('setWordsGroupsDetailsView', { variable, data })
  }
}

const mutations = {
  setWordsGrid(state: ViewsState, { variable, data }: WordsGridType) {
    switch (variable) {
      case 'filterItemsState':
        state.$WordsGrid[variable] =
          data as (typeof state.$WordsGrid)['filterItemsState']
        break
      case 'isItemsState':
        state.$WordsGrid[variable] =
          data as (typeof state.$WordsGrid)['isItemsState']
        break
      case 'jumpPage':
      case 'jumpScroll':
        state.$WordsGrid[variable] = data as boolean
        break
      case 'currentScrollY':
      case 'currentPageSize':
        state.$WordsGrid[variable] = data as number
        break
      case 'currentPage':
        state.$WordsGrid[variable] = data as string
        break
      default:
        break
    }
  },
  setArticlesView(state: ViewsState, { variable, data }: ArticlesViewType) {
    switch (variable) {
      case 'jumpPage':
      case 'jumpScroll':
        state.$ArticlesView[variable] = data as boolean
        break
      case 'currentScrollY':
      case 'currentPageSize':
        state.$ArticlesView[variable] = data as number
        break
      case 'currentPage':
        state.$ArticlesView[variable] = data as string
        break
      default:
        break
    }
  },
  setWordsGroupsView(
    state: ViewsState,
    { variable, data }: { variable: string; data: groupArray }
  ) {
    if (variable === 'groupArray' && data.checked === true) {
      state.$WordsGroupsView[variable].push(data)
    } else if (variable === 'groupArray' && data.checked === false) {
      const index = state.$WordsGroupsView[variable].findIndex(
        (item) => item.ws_id === data.ws_id
      )
      if (index !== -1) {
        state.$WordsGroupsView[variable].splice(index, 1)
      }
    } else if (variable === 'wg_name' && typeof data === 'string') {
      state.$WordsGroupsView.wg_name = data
    } else if (variable === 'id' && typeof data === 'number') {
      state.$WordsGroupsView.id = data
    } else if (variable === 'clear' && typeof data === 'boolean') {
      if (data === true) {
        state.$WordsGroupsView['groupArray'] = []
        state.$WordsGroupsView.wg_name = ''
        state.$WordsGroupsView.id = null
      }
    }
  },
  setWordsGroupsDetailsView(
    state: ViewsState,
    { variable, data }: WordsGroupsDetailsViewType
  ) {
    state.$WordsGroupsDetailsView[variable] = data
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
