import CategoriesRepo from '@/repositories/CategoriesRepo.ts'
import { addValueKey } from '@/libs/dataHelpers.js'

const state = {
  categories: [],
  category: {},
  categoryForm: {
    cate_name: '',
    cate_parent_id: '',
    cate_level: '',
    cate_order: ''
  },
  recentCategories: []
}

const getters = {
  categories: (state) => state.categories,
  categoryForm: (state) => state.categoryForm,
  categoriesTransformed: (state) => {
    return addValueKey(state.categories, 'cate_name')
  },
  categoriesArray: (state) => {
    return Object.keys(state.categories).map((key) => ({
      key,
      ...state.categories[key]
    }))
  },
  recentCategoriesArray: (state) => {
    return Object.keys(state.recentCategories).map((key) => ({
      key,
      ...state.recentCategories[key]
    }))
  },
  categoriesEditArray: (state) => {
    const flattenArray = []

    function flattenData(data) {
      data.forEach((item) => {
        const newItem = { ...item }
        if (newItem.children && newItem.children.length > 0) {
          flattenArray.push(newItem)
          flattenData(newItem.children)
          newItem.children = []
        } else {
          flattenArray.push(newItem)
        }
      })
    }

    flattenData(Object.values(state.tags))

    return flattenArray.map((item, index) => ({
      key: index,
      ...item
    }))
  }
}

const actions = {
  async fetch({ commit }) {
    const data = await CategoriesRepo.get()
    commit('set', data)
  },

  async fetchRecent({ commit }) {
    const data = await CategoriesRepo.getRecent()
    commit('setRecent', data)
  },

  async fetchById({ commit }, id) {
    const data = await CategoriesRepo.getById(id)
    commit('setByID', data)
  },

  async add({ commit, dispatch }, data) {
    await CategoriesRepo.add(data)
    await dispatch('fetch')
    await dispatch('fetchRecent')
  },

  async update({ commit, dispatch }, { id, data }) {
    await CategoriesRepo.update(id, data)
    await dispatch('fetch')
    await dispatch('fetchRecent')
  },

  async updateOrder({ commit, dispatch }, data) {
    await CategoriesRepo.updateOrder(data)
    await dispatch('fetch')
    await dispatch('fetchRecent')
  },

  async deleteById({ commit, dispatch }, id) {
    await CategoriesRepo.deleteById(id)
    await dispatch('fetch')
    await dispatch('fetchRecent')
  }
}

const mutations = {
  set: (state, data) => (state.categories = data),
  setByID: (state, data) => (state.category = data),
  setRecent: (state, data) => (state.recentCategories = data)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
