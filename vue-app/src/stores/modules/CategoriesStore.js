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
    const data = await CategoriesRepo.get()
    commit('set', data)
  },
  async fetchById ({ commit }, id) {
    const data = await CategoriesRepo.getById(id)
    commit('setByID', data)
  },
  async add ({ commit }, data) {
    await CategoriesRepo.add(data)
  },

  async update ({ commit }, { id, data }) {
    await CategoriesRepo.update(id, data)
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
