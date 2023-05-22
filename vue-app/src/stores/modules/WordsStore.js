import WordsRepo from '@/repositories/WordsRepo.js'

const state = {
  words: [], // All
  word: {} // One
}

const getters = {
  words: (state) => state.words,
  word: (state) => state.word,
  wordsArray: (state) => {
    return Object.keys(state.words).map(key => ({
      key,
      ...state.words[key]
    }))
  }
}

const actions = {
  async fetch ({ commit }) {
    const data = await WordsRepo.get()
    commit('set', data)
  },

  async fetchById ({ commit }, id) {
    const data = await WordsRepo.getById(id)
    commit('setByID', data)
  },

  async add ({ commit, dispatch }, data) {
    await WordsRepo.add(data)
  },

  async update ({ commit, dispatch }, { id, data }) {
    await WordsRepo.update(id, data)
  }
}

const mutations = {
  set: (state, data) => (state.words = data),
  setByID: (state, data) => (state.word = data)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
