import { GetterTree, Commit, Dispatch } from 'vuex'
import WordsRepo from '@/repositories/WordsRepo.ts'
import { Word, WordForm, RootState } from '@/interfaces/Words.ts'
import { generalFilterWords as generalFilter } from '@/libs/filterHelper'

const state = {
  words: [] as Word[],
  word: {} as Word,
  wordForm: {} as WordForm
}

const getters: GetterTree<RootState, RootState> = {
  words: (state) => state.words,
  word: (state) => state.word,
  wordById: (state) => (id: number) => {
    return state.words.find((word) => String(word.id) === String(id))
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
      keyword: string,
      options: string[],
      tagsArray: number[],
      tagsOperator: string,
      choiceArray: string[],
      choiceOperator: string
    ) => {
      return generalFilter(
        state.words,
        keyword,
        options,
        tagsArray,
        tagsOperator,
        choiceArray,
        choiceOperator
      )
    }
}

const actions = {
  async fetch({ commit }: { commit: Commit }) {
    const data = await WordsRepo.get()
    commit('set', data)
  },

  async fetchById({ commit }: { commit: Commit }, id: number) {
    const data = await WordsRepo.getById(id)
    commit('setByID', data)
  },

  async add({ dispatch }: { dispatch: Dispatch }, data: WordForm) {
    await WordsRepo.add(data)
    await dispatch('fetch')
  },

  async update(
    { dispatch }: { dispatch: Dispatch },
    { id, data }: { id: number; data: Word }
  ) {
    await WordsRepo.update(id, data)
    await dispatch('fetch')
  },

  async updateCommon(
    { dispatch }: { dispatch: Dispatch },
    { id, data }: { id: number; data: { ws_is_common: boolean } }
  ) {
    await WordsRepo.updateCommon(id, data)
    await dispatch('fetch')
  },

  async updateImportant(
    { dispatch }: { dispatch: Dispatch },
    { id, data }: { id: number; data: { ws_is_important: boolean } }
  ) {
    await WordsRepo.updateImportant(id, data)
    await dispatch('fetch')
  },

  async deleteById({ dispatch }: { dispatch: Dispatch }, id: number) {
    await WordsRepo.deleteById(id)
    await dispatch('fetch')
  }
}
type State = typeof state
const mutations = {
  set: (state: State, data: Word[]) => (state.words = data),
  setByID: (state: State, data: Word) => (state.word = data)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
