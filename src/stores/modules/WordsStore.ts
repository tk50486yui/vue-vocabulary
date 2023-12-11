import { GetterTree, Commit, Dispatch } from 'vuex'
import WordsRepo from '@/repositories/WordsRepo'
import { Word, WordForm, WordsState } from '@/interfaces/Words'
import { RootState } from '@/interfaces/RootState'
import { generalFilterWords as generalFilter } from '@/libs/filterHelper'
import { sortedWords } from '@/libs/sortHelper'

const state = {
  words: [] as Word[],
  word: {} as Word,
  wordForm: {} as WordForm,
  files: [] as string[]
}

const getters: GetterTree<WordsState, RootState> = {
  words: (state) => state.words,
  word: (state) => state.word,
  wordById: (state) => (id: number) => {
    return state.words.find((word) => String(word.id) === String(id))
  },
  wordForm: (state) => state.wordForm,
  wordsArray: (state) => {
    return Object.entries(state.words).map(([key, value]) => ({
      key,
      ...value
    }))
  },
  files: (state) => state.files,
  filterWords:
    (state) =>
    (
      keyword: string,
      options: string[],
      tagsArray: number[],
      tagsOperator: string,
      choiceArray: string[],
      choiceOperator: string,
      sortValue: string
    ) => {
      const filteredWords = generalFilter(
        state.words,
        keyword,
        options,
        tagsArray,
        tagsOperator,
        choiceArray,
        choiceOperator
      )
      if (sortValue && sortValue !== null) {
        const splitSortValue = sortValue.split(',')
        return sortedWords(filteredWords, splitSortValue)
      }

      return filteredWords
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

  async update({ dispatch }: { dispatch: Dispatch }, { id, data }: { id: number; data: WordForm }) {
    await WordsRepo.update(id, data)
    await dispatch('fetch')
  },

  async updateCommon(
    { dispatch }: { dispatch: Dispatch },
    { id, data }: { id: number; data: { ws_is_common: boolean } }
  ) {
    await WordsRepo.updateCommon(id, data, { tagType: 'heart' })
    await dispatch('fetch')
  },

  async updateImportant(
    { dispatch }: { dispatch: Dispatch },
    { id, data }: { id: number; data: { ws_is_important: boolean } }
  ) {
    await WordsRepo.updateImportant(id, data, { tagType: 'star' })
    await dispatch('fetch')
  },

  async deleteById({ dispatch }: { dispatch: Dispatch }, id: number) {
    await WordsRepo.deleteById(id)
    await dispatch('fetch')
  },

  async fetchFiles({ commit }: { commit: Commit }) {
    const data = await WordsRepo.getFiles()
    commit('setFiles', data)
  },

  async upload({ dispatch }: { dispatch: Dispatch }, data: WordForm) {
    await WordsRepo.upload(data)
    await dispatch('fetchFiles')
  },

  async deleteFile({ dispatch }: { dispatch: Dispatch }, id: string) {
    await WordsRepo.deleteFile(id)
    await dispatch('fetchFiles')
  }
}
type State = typeof state
const mutations = {
  set: (state: State, data: Word[]) => (state.words = data),
  setByID: (state: State, data: Word) => (state.word = data),
  setFiles: (state: State, data: string[]) => (state.files = data)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
