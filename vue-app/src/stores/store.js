import Vuex from 'vuex'
import WordsStore from '@/stores/modules/WordsStore.js'
import CategoriesStore from '@/stores/modules/CategoriesStore.js'
import TagsStore from '@/stores/modules/TagsStore.js'
import ArticlesStore from '@/stores/modules/ArticlesStore.js'
import Theme from '@/stores/Theme.js'

const store = new Vuex.Store({

  modules: {
    WordsStore,
    CategoriesStore,
    TagsStore,
    ArticlesStore,
    Theme
  }
})

export { store }
