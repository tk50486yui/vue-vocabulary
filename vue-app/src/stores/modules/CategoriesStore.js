
const state = {
  categories: []
}

const getters = {
  getCategories: (state) => state.categories
}

const actions = {
  async fetchCategories ({ commit }) {
    const response = await this.$axios.get(this.$api + '/categories')
    commit('set', response.data)
  }
}

const mutations = {
  set: (state, data) => (state.categories = data)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
