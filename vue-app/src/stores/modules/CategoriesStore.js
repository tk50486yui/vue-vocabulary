import CategoriesRepo from '@/repositories/CategoriesRepo.js'
import { addValueKey } from '@/libs/dataHelpers.js'

const state = {
  categories: [],
  category: {},
  categoryForm: {
    cate_name: '',
    cate_parent_id: '',
    cate_level: '',
    cate_order: ''
  }
}

const getters = {
  categories: (state) => state.categories,
  categoryForm: (state) => state.categoryForm,
  categoriesTransformed: (state) => {
    return addValueKey(state.categories, 'cate_name')
  }
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

  async add ({ commit, dispatch }, data) {
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
