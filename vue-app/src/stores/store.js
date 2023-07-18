import Vuex from 'vuex'
import WordsStore from '@/stores/modules/WordsStore.js'
import CategoriesStore from '@/stores/modules/CategoriesStore.js'
import TagsStore from '@/stores/modules/TagsStore.js'
import ArticlesStore from '@/stores/modules/ArticlesStore.js'
import WordsGroupsStore from '@/stores/modules/WordsGroupsStore.js'
import Theme from '@/stores/Theme.js'
import Screen from '@/stores/Screen.js'
import Search from '@/stores/Search.js'
import Views from '@/stores/Views.js'

const store = new Vuex.Store({

  modules: {
    WordsStore,
    CategoriesStore,
    TagsStore,
    ArticlesStore,
    WordsGroupsStore,
    Theme,
    Screen,
    Search,
    Views
  }
})

export { store }
