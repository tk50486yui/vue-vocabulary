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
    return state.articles.find(article => parseInt(article.id) === parseInt(id))
  },
  articleForm: (state) => state.articleForm,
  articlesArray: (state) => {
    return Object.keys(state.articles).map(key => ({
      key,
      ...state.articles[key]
    }))
  },
  filterArticles: (state) => (keyword, options, tagsArray, tagsOperator) => {
    let currentFiltered = []
    // 第一次 關鍵字
    if (keyword && options && options.length > 0) {
      currentFiltered = Object.keys(state.articles)
        .filter(key => {
          const article = state.articles[key]
          return options.some(option => article[option] && article[option].includes(keyword))
        })
        .map(key => ({
          key,
          ...state.articles[key]
        }))
    } else {
      currentFiltered = Object.keys(state.articles).map(key => ({
        key,
        ...state.articles[key]
      }))
    }
    // 第二次用 tags 篩選 接續第一個篩選結果
    if (tagsOperator === 'none') { // NONE
      currentFiltered = currentFiltered.filter(article => {
        return !article.articles_tags.values || article.articles_tags.values.length === 0
      })
    } else if (tagsArray && tagsArray.length > 0) {
      // AND
      if (tagsOperator && tagsOperator === 'and' && tagsArray.length >= 1) {
        // length = 1
        if (tagsArray.length === 1) {
          currentFiltered = currentFiltered.filter(article => {
            return (
              article.articles_tags.values &&
              article.articles_tags.values.length === tagsArray.length &&
              tagsArray.every(tag => article.articles_tags.values.some(t => t.ts_id === tag))
            )
          })
        } else { // length > 1
          currentFiltered = currentFiltered.filter(article => {
            return (
              article.articles_tags.values &&
              article.articles_tags.values.length >= tagsArray.length &&
              tagsArray.every(tag => article.articles_tags.values.some(t => t.ts_id === tag))
            )
          })
        }
      } else { // OR
        currentFiltered = currentFiltered.filter(article => {
          return (
            article.articles_tags.values &&
            article.articles_tags.values.some(tag => tagsArray.includes(tag.ts_id))
          )
        })
      }
    }

    return currentFiltered
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
    await dispatch('fetch')
  },

  async update ({ commit, dispatch }, { id, data }) {
    await ArticlesRepo.update(id, data)
    await dispatch('fetch')
  },

  async deleteById ({ commit, dispatch }, id) {
    await ArticlesRepo.deleteById(id)
    await dispatch('fetch')
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
