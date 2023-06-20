import WordsRepo from '@/repositories/WordsRepo.js'

const state = {
  words: [],
  word: {},
  wordForm: {
    ws_name: '',
    ws_definition: '',
    ws_pronunciation: '',
    ws_description: '',
    ws_slogan: '',
    ws_is_important: '',
    ws_is_common: '',
    ws_forget_count: '',
    ws_order: '',
    cate_id: ''
  }
}

const getters = {
  words: (state) => state.words,
  word: (state) => state.word,
  wordForm: (state) => state.wordForm,
  wordsArray: (state) => {
    return Object.keys(state.words).map(key => ({
      key,
      ...state.words[key]
    }))
  },
  filterWords: (state) => (keyword) => {
    if (keyword) {
      return Object.keys(state.words)
        .filter(key => state.words[key].ws_name.includes(keyword))
        .map(key => ({
          key,
          ...state.words[key]
        }))
    } else {
      return Object.keys(state.words).map(key => ({
        key,
        ...state.words[key]
      }))
    }
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
