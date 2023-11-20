import { GetterTree, Commit, Dispatch } from 'vuex'
import TagsColorRepo from '@/repositories/TagsColorRepo.ts'
import { TagsColor, TagsColorForm, RootState } from '@/interfaces/TagsColor.ts'

const state = {
  tagsColor: [] as TagsColor[],
  tagsColorForm: {} as TagsColorForm
}

const getters: GetterTree<RootState, RootState> = {
  tagsColor: (state) => state.tagsColor,
  tagsColorForm: (state) => state.tagsColorForm,
  tagsColorArray: (state) => {
    return Object.keys(state.tagsColor).map((key) => ({
      key,
      ...state.tagsColor[key]
    }))
  }
}

const actions = {
  async fetch({ commit }: { commit: Commit }) {
    const data = await TagsColorRepo.get()
    commit('set', data)
  },

  async add({ dispatch }: { dispatch: Dispatch }, data: TagsColorForm) {
    await TagsColorRepo.add(data)
    await dispatch('fetch')
  },

  async update(
    { dispatch }: { dispatch: Dispatch },
    { id, data }: { id: number; data: TagsColor }
  ) {
    await TagsColorRepo.update(id, data)
    await dispatch('fetch')
  },

  async deleteById({ dispatch }: { dispatch: Dispatch }, id: number) {
    await TagsColorRepo.deleteById(id)
    await dispatch('fetch')
  }
}
type State = typeof state
const mutations = {
  set: (state: State, data: TagsColor[]) => (state.tagsColor = data)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
