import ArticlesRepo from '@/repositories/ArticlesRepo.js'

const state = {
  articles: [],
  article: {},
  articleForm: {
    arti_title: '',
    arti_content: '',
    arti_order: '',
    cate_id: '',
    articles_tags: { array: [], values: [] }
  }
}

const getters = {
  articles: (state) => state.articles,
  article: (state) => state.article,
  articleById: state => id => {
    return state.articles.find(article => article.id === id)
  },
  articleForm: (state) => state.articleForm,
  articlesArray: (state) => {
    return Object.keys(state.articles).map(key => ({
      key,
      ...state.articles[key]
    }))
  },
  filterArticles: (state) => (keyword, options) => {
    if (keyword && options && options.length > 0) {
      return Object.keys(state.articles)
        .filter(key => {
          const article = state.articles[key]
          return options.some(option => article[option] && article[option].includes(keyword))
        })
        .map(key => ({
          key,
          ...state.articles[key]
        }))
    } else {
      return Object.keys(state.articles).map(key => ({
        key,
        ...state.articles[key]
      }))
    }
  }
}

const actions = {
  async fetch ({ commit }) {
    const data = await ArticlesRepo.get()
    commit('set', data)
  },

  async fetchById ({ commit }, id) {
    const data = await ArticlesRepo.getById(id)
    commit('setByID', data)
  },

  async add ({ commit, dispatch }, data) {
    await ArticlesRepo.add(data)
  },

  async update ({ commit, dispatch }, { id, data }) {
    await ArticlesRepo.update(id, data)
  }
}

const mutations = {
  set: (state, data) => (state.articles = data),
  setByID: (state, data) => (state.article = data)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
