import { GetterTree, Commit, Dispatch } from 'vuex'
import WordsGroupsRepo from '@/repositories/WordsGroupsRepo'
import {
  WordsGroup,
  WordsGroupsForm,
  RootState
} from '@/interfaces/WordsGroups'

const state = {
  wordsGroups: [] as WordsGroup[],
  wordsGroup: {} as WordsGroup,
  wordsGroupsForm: {} as WordsGroupsForm
}

const getters: GetterTree<RootState, RootState> = {
  wordsGroups: (state) => state.wordsGroups,
  wordsGroupsById: (state) => (id: number) => {
    return state.wordsGroups.find(
      (wordsGroup) => String(wordsGroup.id) === String(id)
    )
  },
  wordsGroupsForm: (state) => state.wordsGroupsForm
}

const actions = {
  async fetch({ commit }: { commit: Commit }) {
    const data = await WordsGroupsRepo.get()
    commit('set', data)
  },

  async fetchById({ commit }: { commit: Commit }, id: number) {
    const data = await WordsGroupsRepo.getById(id)
    commit('setByID', data)
  },

  async add({ dispatch }: { dispatch: Dispatch }, data: WordsGroupsForm) {
    await WordsGroupsRepo.add(data)
    await dispatch('fetch')
  },

  async update(
    { dispatch }: { dispatch: Dispatch },
    { id, data }: { id: number; data: WordsGroupsForm }
  ) {
    await WordsGroupsRepo.update(id, data)
    await dispatch('fetch')
  },

  async deleteById({ dispatch }: { dispatch: Dispatch }, id: number) {
    await WordsGroupsRepo.deleteById(id)
    await dispatch('fetch')
  }
}
type State = typeof state
const mutations = {
  set: (state: State, data: WordsGroup[]) => (state.wordsGroups = data),
  setByID: (state: State, data: WordsGroup) => (state.wordsGroup = data)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
