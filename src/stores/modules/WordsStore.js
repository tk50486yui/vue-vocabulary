import WordsRepo from '@/repositories/WordsRepo.ts'

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
  wordById: (state) => (id) => {
    return state.words.find((word) => parseInt(word.id) === parseInt(id))
  },
  wordForm: (state) => state.wordForm,
  wordsArray: (state) => {
    return Object.keys(state.words).map((key) => ({
      key,
      ...state.words[key]
    }))
  },
  filterWords:
    (state) =>
    (
      keyword,
      options,
      tagsArray,
      choiceArray,
      tagsOperator,
      choiceOperator
    ) => {
      let currentFilteredWords = []
      // 第一次搜尋篩選 (關鍵字及類別共用)
      if (keyword && options && options.length > 0) {
        currentFilteredWords = Object.keys(state.words)
          .filter((key) => {
            const word = state.words[key]
            return options.some(
              (option) => word[option] && word[option].includes(keyword)
            )
          })
          .map((key) => ({
            key,
            ...state.words[key]
          }))
      } else {
        currentFilteredWords = Object.keys(state.words).map((key) => ({
          key,
          ...state.words[key]
        }))
      }

      // 第二次用 tags 篩選 接續第一個篩選結果
      if (tagsOperator === 'none') {
        // NONE
        currentFilteredWords = currentFilteredWords.filter((word) => {
          return !word.words_tags.values || word.words_tags.values.length === 0
        })
      } else if (tagsArray && tagsArray.length > 0) {
        // AND
        if (tagsOperator && tagsOperator === 'and' && tagsArray.length >= 1) {
          // length = 1
          if (tagsArray.length === 1) {
            currentFilteredWords = currentFilteredWords.filter((word) => {
              return (
                word.words_tags.values &&
                word.words_tags.values.length === tagsArray.length &&
                tagsArray.every((tag) =>
                  word.words_tags.values.some((t) => t.ts_id === tag)
                )
              )
            })
          } else {
            // length > 1
            currentFilteredWords = currentFilteredWords.filter((word) => {
              return (
                word.words_tags.values &&
                word.words_tags.values.length >= tagsArray.length &&
                tagsArray.every((tag) =>
                  word.words_tags.values.some((t) => t.ts_id === tag)
                )
              )
            })
          }
        } else {
          // OR
          currentFilteredWords = currentFilteredWords.filter((word) => {
            return (
              word.words_tags.values &&
              word.words_tags.values.some((tag) =>
                tagsArray.includes(tag.ts_id)
              )
            )
          })
        }
      }
      // 第三次用 ws_is_important ws_is_common 篩選 接續第二個篩選結果 OR AND NONE
      if (choiceOperator === 'none') {
        // NONE
        return currentFilteredWords.filter((word) => {
          return word.ws_is_important === false && word.ws_is_common === false
        })
      } else if (choiceArray && choiceArray.length > 0) {
        // AND
        if (
          choiceOperator &&
          choiceOperator === 'and' &&
          choiceArray.length >= 1
        ) {
          return currentFilteredWords.filter((word) => {
            if (
              choiceArray.includes('ws_is_important') &&
              choiceArray.includes('ws_is_common')
            ) {
              return word.ws_is_important === true && word.ws_is_common === true
            } else if (choiceArray.includes('ws_is_important')) {
              return (
                word.ws_is_important === true && word.ws_is_common === false
              )
            } else if (choiceArray.includes('ws_is_common')) {
              return (
                word.ws_is_important === false && word.ws_is_common === true
              )
            } else {
              return currentFilteredWords
            }
          })
        } else {
          // OR
          return currentFilteredWords.filter((word) => {
            if (
              choiceArray.includes('ws_is_important') &&
              choiceArray.includes('ws_is_common')
            ) {
              return word.ws_is_important === true || word.ws_is_common === true
            } else if (choiceArray.includes('ws_is_important')) {
              return word.ws_is_important === true
            } else if (choiceArray.includes('ws_is_common')) {
              return word.ws_is_common === true
            } else {
              return currentFilteredWords
            }
          })
        }
      } else {
        return currentFilteredWords
      }
    }
}

const actions = {
  async fetch({ commit }) {
    const data = await WordsRepo.get()
    commit('set', data)
  },

  async fetchById({ commit }, id) {
    const data = await WordsRepo.getById(id)
    commit('setByID', data)
  },

  async add({ commit, dispatch }, data) {
    await WordsRepo.add(data)
    await dispatch('fetch')
  },

  async update({ commit, dispatch }, { id, data }) {
    await WordsRepo.update(id, data)
    await dispatch('fetch')
  },

  async updateCommon({ commit, dispatch }, { id, data }) {
    await WordsRepo.updateCommon(id, data)
    await dispatch('fetch')
  },

  async updateImportant({ commit, dispatch }, { id, data }) {
    await WordsRepo.updateImportant(id, data)
    await dispatch('fetch')
  },

  async deleteById({ commit, dispatch }, id) {
    await WordsRepo.deleteById(id)
    await dispatch('fetch')
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
