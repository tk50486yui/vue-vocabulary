import { GetterTree, Commit, Dispatch } from 'vuex'
import TagsRepo from '@/repositories/TagsRepo.ts'
import { Tag, TagForm, TagsOrder, RootState } from '@/interfaces/Tags.ts'

const state = {
  tags: [] as Tag[],
  tag: {} as Tag,
  tagForm: {} as TagForm,
  recentTags: [] as Tag[]
}

const getters: GetterTree<RootState, RootState> = {
  tags: (state) => state.tags,
  tagForm: (state) => state.tagForm,
  tagsArray: (state) => {
    return Object.keys(state.tags).map((key) => ({
      key,
      ...state.tags[key]
    }))
  },
  recentTagsArray: (state) => {
    return Object.keys(state.recentTags).map((key) => ({
      key,
      ...state.recentTags[key]
    }))
  }
}

const actions = {
  async fetch({ commit }: { commit: Commit }) {
    const data = await TagsRepo.get()
    commit('set', data)
  },

  async fetchRecent({ commit }: { commit: Commit }) {
    const data = await TagsRepo.getRecent()
    commit('setRecent', data)
  },

  async fetchById({ commit }: { commit: Commit }, id: number) {
    const data = await TagsRepo.getById(id)
    commit('setByID', data)
  },

  async add({ dispatch }: { dispatch: Dispatch }, data: TagForm) {
    await TagsRepo.add(data)
    await dispatch('fetch')
    await dispatch('fetchRecent')
  },

  async update(
    { dispatch }: { dispatch: Dispatch },
    { id, data }: { id: number, data: Tag }
  ) {
    await TagsRepo.update(id, data)
    await dispatch('fetch')
    await dispatch('fetchRecent')
  },

  async updateOrder({ dispatch }: { dispatch: Dispatch }, data: TagsOrder[]) {
    await TagsRepo.updateOrder(data)
    await dispatch('fetch')
    await dispatch('fetchRecent')
  },

  async deleteById({ dispatch }: { dispatch: Dispatch }, id: number) {
    await TagsRepo.deleteById(id)
    await dispatch('fetch')
    await dispatch('fetchRecent')
  }
}
type State = typeof state
const mutations = {
  set: (state: State, data: Tag[]) => (state.tags = data),
  setByID: (state: State, data: Tag) => (state.tag = data),
  setRecent: (state: State, data: Tag[]) => (state.recentTags = data)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
