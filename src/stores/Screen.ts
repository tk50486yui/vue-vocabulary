import { Commit } from 'vuex'
interface RootState {
  $mobile: boolean
  $tablet: boolean
  $desktop: boolean
}

const state: RootState = {
  $mobile: false,
  $tablet: false,
  $desktop: false
}

const actions = {
  updateMobile({ commit }: { commit: Commit }, screen: boolean) {
    commit('setMobile', screen)
  },
  updateTablet({ commit }: { commit: Commit }, screen: boolean) {
    commit('setTablet', screen)
  },
  updateDesktop({ commit }: { commit: Commit }, screen: boolean) {
    commit('setDesktop', screen)
  }
}

const mutations = {
  setMobile(state: RootState, value: boolean) {
    state.$mobile = value
  },
  setTablet(state: RootState, value: boolean) {
    state.$tablet = value
  },
  setDesktop(state: RootState, value: boolean) {
    state.$desktop = value
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
