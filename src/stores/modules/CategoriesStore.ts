import { GetterTree, Commit, Dispatch } from 'vuex'
import CategoriesRepo from '@/repositories/CategoriesRepo'
import {
  Category,
  CategoryForm,
  CategoriesOrder,
  CategoriesState
} from '@/interfaces/Categories'
import { RootState } from '@/interfaces/RootState'

const state = {
  categories: [] as Category[],
  category: {} as Category,
  categoryForm: {} as CategoryForm,
  recentCategories: [] as Category[]
}

const getters: GetterTree<CategoriesState, RootState> = {
  categories: (state) => state.categories,
  categoryForm: (state) => state.categoryForm,
  categoriesArray: (state) => {
    return Object.entries(state.categories).map(([key, value]) => ({
      key,
      ...value
    }))
  },
  recentCategoriesArray: (state) => {
    return Object.entries(state.recentCategories).map(([key, value]) => ({
      key,
      ...value
    }))
  }
}

const actions = {
  async fetch({ commit }: { commit: Commit }) {
    const data = await CategoriesRepo.get()
    commit('set', data)
  },

  async fetchRecent({ commit }: { commit: Commit }) {
    const data = await CategoriesRepo.getRecent()
    commit('setRecent', data)
  },

  async fetchById({ commit }: { commit: Commit }, id: number) {
    const data = await CategoriesRepo.getById(id)
    commit('setByID', data)
  },

  async add({ dispatch }: { dispatch: Dispatch }, data: CategoryForm) {
    await CategoriesRepo.add(data)
    await dispatch('fetch')
    await dispatch('fetchRecent')
  },

  async update(
    { dispatch }: { dispatch: Dispatch },
    { id, data }: { id: number; data: Category }
  ) {
    await CategoriesRepo.update(id, data)
    await dispatch('fetch')
    await dispatch('fetchRecent')
  },

  async updateOrder(
    { dispatch }: { dispatch: Dispatch },
    data: CategoriesOrder[]
  ) {
    await CategoriesRepo.updateOrder(data)
    await dispatch('fetch')
    await dispatch('fetchRecent')
  },

  async deleteById({ dispatch }: { dispatch: Dispatch }, id: number) {
    await CategoriesRepo.deleteById(id)
    await dispatch('fetch')
    await dispatch('fetchRecent')
  }
}
type State = typeof state
const mutations = {
  set: (state: State, data: Category[]) => (state.categories = data),
  setByID: (state: State, data: Category) => (state.category = data),
  setRecent: (state: State, data: Category[]) => (state.recentCategories = data)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
