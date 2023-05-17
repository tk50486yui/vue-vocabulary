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
    try {
      const data = await WordsRepo.get()
      commit('set', data)
    } catch (error) {}
  },

  async fetchById ({ commit }, id) {
    try {
      const data = await WordsRepo.getById(id)
      commit('setByID', data)
    } catch (error) {}
  },

  async add ({ commit }, data) {
    try {
      await WordsRepo.add(data)
    } catch (error) {}
  },

  async update ({ commit }, { id, data }) {
    try {
      await WordsRepo.update(id, data)
    } catch (error) {}
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
