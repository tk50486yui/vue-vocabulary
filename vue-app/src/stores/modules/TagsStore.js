import TagsRepo from '@/repositories/TagsRepo.js'
import { addValueKey } from '@/libs/dataHelpers.js'

const state = {
  tags: [],
  tag: {},
  tagForm: {
    ts_name: '',
    ts_storage: '',
    ts_parent_id: '',
    ts_level: '',
    ts_order: '',
    ts_description: ''
  },
  recentTags: []
}

const getters = {
  tags: (state) => state.tags,
  tagForm: (state) => state.tagForm,
  tagsTransformed: (state) => {
    return addValueKey(state.tags, 'ts_name')
  },
  tagsArray: (state) => {
    return Object.keys(state.tags).map(key => ({
      key,
      ...state.tags[key]
    }))
  },
  recentTagsArray: (state) => {
    return Object.keys(state.recentTags).map(key => ({
      key,
      ...state.recentTags[key]
    }))
  },
  tagsEditArray: (state) => {
    const flattenArray = []

    function flattenData (data) {
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
  async fetch ({ commit }) {
    const data = await TagsRepo.get()
    commit('set', data)
  },

  async fetchRecent ({ commit }) {
    const data = await TagsRepo.getRecent()
    commit('setRecent', data)
  },

  async fetchById ({ commit }, id) {
    const data = await TagsRepo.getById(id)
    commit('setByID', data)
  },

  async add ({ commit, dispatch }, data) {
    await TagsRepo.add(data)
  },

  async update ({ commit }, { id, data }) {
    await TagsRepo.update(id, data)
  },

  async updateOrder ({ commit }, data) {
    await TagsRepo.updateOrder(data)
  }

}

const mutations = {
  set: (state, data) => (state.tags = data),
  setByID: (state, data) => (state.tag = data),
  setRecent: (state, data) => (state.recentTags = data)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
