
const state = {
  words: []
}

const getters = {
  getWords: (state) => state.words
}

const actions = {
  async fetchWords ({ commit }) {
    const response = await this.$axios.get(this.$api + '/words')
    commit('set', response.data)
  }
}

const mutations = {
  set: (state, data) => (state.words = data)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
