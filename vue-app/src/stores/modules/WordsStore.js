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
    cate_id: '',
    words_tags: { array: [], values: [] }
  }
}

const getters = {
  words: (state) => state.words,
  word: (state) => state.word,
  wordById: state => id => {
    return state.words.find(word => parseInt(word.id) === parseInt(id))
  },
  wordForm: (state) => state.wordForm,
  wordsArray: (state) => {
    return Object.keys(state.words).map(key => ({
      key,
      ...state.words[key]
    }))
  },
  filterWords: (state) => (keyword, options, tagsArray) => {
    let firstFilteredWords = []
    // 第一次搜尋篩選
    if (keyword && options && options.length > 0) {
      firstFilteredWords = Object.keys(state.words)
        .filter(key => {
          const word = state.words[key]
          return options.some(option => word[option] && word[option].includes(keyword))
        })
        .map(key => ({
          key,
          ...state.words[key]
        }))
      return firstFilteredWords
    } else {
      firstFilteredWords = Object.keys(state.words).map(key => ({
        key,
        ...state.words[key]
      }))
    }
    // 第二次用tags分類篩選
    if (tagsArray && tagsArray.length > 0) {
      return firstFilteredWords.filter(word => {
        return (
          word.words_tags.values &&
          word.words_tags.values.some(tag => tagsArray.includes(tag.ts_name))
        )
      })
    } else {
      return firstFilteredWords
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
  },

  async updateCommon ({ commit, dispatch }, { id, data }) {
    await WordsRepo.updateCommon(id, data)
  },

  async  updateImportant ({ commit, dispatch }, { id, data }) {
    await WordsRepo.updateImportant(id, data)
  },

  async deleteById ({ commit }, id) {
    await WordsRepo.deleteById(id)
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
