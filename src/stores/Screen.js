const state = {
  $mobile: false,
  $tablet: false,
  $desktop: false
}

const actions = {
  updateMobile({ commit }, screen) {
    commit('setMobile', screen)
  },
  updateTablet({ commit }, screen) {
    commit('setTablet', screen)
  },
  updateDesktop({ commit }, screen) {
    commit('setDesktop', screen)
  }
}

const mutations = {
  setMobile(state, value) {
    state.$mobile = value
  },
  setTablet(state, value) {
    state.$tablet = value
  },
  setDesktop(state, value) {
    state.$desktop = value
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
