import { Commit } from 'vuex'
interface ScreenState {
  $mobile: boolean
  $tablet: boolean
  $desktop: boolean
}

const state: ScreenState = {
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
  setMobile(state: ScreenState, value: boolean) {
    state.$mobile = value
    state.$tablet = false
    state.$desktop = false
  },
  setTablet(state: ScreenState, value: boolean) {
    state.$tablet = value
    state.$mobile = false
    state.$desktop = false
  },
  setDesktop(state: ScreenState, value: boolean) {
    state.$desktop = value
    state.$mobile = false
    state.$tablet = false
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
