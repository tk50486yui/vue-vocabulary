import WordsGroupsRepo from '@/repositories/WordsGroupsRepo.js'

const state = {
  wordsGroups: [],
  wordsGroup: {},
  wordsGroupsForm: {
    wg_name: '',
    words_groups_datails: []
  }
}

const getters = {
  wordsGroups: (state) => state.wordsGroups,
  wordsGroupsForm: (state) => state.wordsGroupsForm
}

const actions = {
  async fetch ({ commit }) {
    const data = await WordsGroupsRepo.get()
    commit('set', data)
  },

  async fetchById ({ commit }, id) {
    const data = await WordsGroupsRepo.getById(id)
    commit('setByID', data)
  },

  async add ({ commit, dispatch }, data) {
    await WordsGroupsRepo.add(data)
  },

  async update ({ commit }, { id, data }) {
    await WordsGroupsRepo.update(id, data)
  }

}

const mutations = {
  set: (state, data) => (state.wordsGroups = data),
  setByID: (state, data) => (state.wordsGroup = data)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
