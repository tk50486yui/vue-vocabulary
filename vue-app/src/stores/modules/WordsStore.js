import WordsRepository from '@/repositories/WordsRepository.js'

const state = {
  words: [],
  word: {}
}

const getters = {
  getAll: (state) => state.words,
  word: (state) => state.word
}

const actions = {
  async fetch ({ commit }) {
    const words = await WordsRepository.get()
    commit('set', words)
  },

  async fetchById ({ commit }, id) {
    const word = await WordsRepository.getById(id)
    commit('setByID', word)
  },
  async add ({ commit }, word) {
    await WordsRepository.add(word)
  },

  async update ({ commit }, { id, word }) {
    await WordsRepository.update(id, word)
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

/** this.$store.commit('WordsStore/setWords', words);
this.$store.commit('WordsStore/addWord', newWord);
this.$store.commit('WordsStore/updateWord', updatedWord);
this.$store.commit('WordsStore/deleteWord', id); */
