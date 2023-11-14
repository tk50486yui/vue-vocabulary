import TagsColorRepo from '@/repositories/TagsColorRepo.js'
import { addValueKey } from '@/libs/dataHelpers.js'

const state = {
  tagsColor: [],
  tagColor: {}
}

const getters = {
  tagsColor: (state) => state.tagsColor,
  tagsColorTransformed: (state) => {
    return addValueKey(state.tagsColor, 'tc_color')
  },
  tagsColorArray: (state) => {
    return Object.keys(state.tagsColor).map(key => ({
      key,
      ...state.tagsColor[key]
    }))
  }
}

const actions = {
  async fetch ({ commit }) {
    const data = await TagsColorRepo.get()
    commit('set', data)
  },

  async fetchById ({ commit }, id) {
    const data = await TagsColorRepo.getById(id)
    commit('setByID', data)
  },

  async add ({ commit, dispatch }, data) {
    await TagsColorRepo.add(data)
  },

  async update ({ commit }, { id, data }) {
    await TagsColorRepo.update(id, data)
  },

  async deleteById ({ commit }, id) {
    await TagsColorRepo.deleteById(id)
  }

}

const mutations = {
  set: (state, data) => (state.tagsColor = data),
  setByID: (state, data) => (state.tagColor = data)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
