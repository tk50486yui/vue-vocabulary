import { GetterTree, Commit, Dispatch } from 'vuex'
import ArticlesRepo from '@/repositories/ArticlesRepo'
import { Article, ArticleForm, ArticlesState } from '@/interfaces/Articles'
import { RootState } from '@/interfaces/RootState'
import { generalFilterArticles as generalFilter } from '@/libs/filterHelper'

const state = {
  articles: [] as Article[],
  article: {} as Article,
  articleForm: {} as ArticleForm
}

const getters: GetterTree<ArticlesState, RootState> = {
  articles: (state) => state.articles,
  article: (state) => state.article,
  articleById: (state) => (id: number) => {
    return state.articles.find((arti) => String(arti.id) === String(id))
  },
  articleForm: (state) => state.articleForm,
  filterArticles:
    (state) =>
    (
      keyword: string,
      options: string[],
      cateId: number,
      tagsArray: number[],
      tagsOperator: string
    ) => {
      return generalFilter(state.articles, keyword, options, cateId, tagsArray, tagsOperator)
    }
}

const actions = {
  async fetch({ commit }: { commit: Commit }) {
    const data = await ArticlesRepo.get()
    commit('set', data)
  },

  async fetchById({ commit }: { commit: Commit }, id: number) {
    const data = await ArticlesRepo.getById(id)
    commit('setByID', data)
  },

  async add({ dispatch }: { dispatch: Dispatch }, data: ArticleForm) {
    await ArticlesRepo.add(data)
    await dispatch('fetch')
  },

  async update({ dispatch }: { dispatch: Dispatch }, { id, data }: { id: number; data: Article }) {
    await ArticlesRepo.update(id, data)
    await dispatch('fetch')
  },

  async deleteById({ dispatch }: { dispatch: Dispatch }, id: number) {
    await ArticlesRepo.deleteById(id)
    await dispatch('fetch')
  }
}

type State = typeof state
const mutations = {
  set: (state: State, data: Article[]) => (state.articles = data),
  setByID: (state: State, data: Article) => (state.article = data)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
