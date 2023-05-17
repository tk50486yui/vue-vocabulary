import CategoriesRepo from '@/repositories/CategoriesRepo.js'

const state = {
  categories: [],
  category: {}
}

const getters = {
  categories: (state) => state.categories
}

const actions = {
  async fetch ({ commit }) {
    try {
      const data = await CategoriesRepo.get()
      commit('set', data)
    } catch (error) {}
  },

  async fetchById ({ commit }, id) {
    try {
      const data = await CategoriesRepo.getById(id)
      commit('setByID', data)
    } catch (error) {}
  },
  async add ({ commit }, data) {
    try {
      await CategoriesRepo.add(data)
    } catch (error) {}
  },

  async update ({ commit }, { id, data }) {
    try {
      await CategoriesRepo.update(id, data)
    } catch (error) {}
  }
}

const mutations = {
  set: (state, data) => (state.categories = data),
  setByID: (state, data) => (state.category = data)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
