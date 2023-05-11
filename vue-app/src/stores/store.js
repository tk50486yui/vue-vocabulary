import Vuex from 'vuex'
import WordsStore from '@/stores/modules/WordsStore.js'
import CategoriesStore from '@/stores/modules/CategoriesStore.js'

const store = new Vuex.Store({
  modules: {
    WordsStore,
    CategoriesStore
  }
})

export { store }
