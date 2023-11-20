import Vuex from 'vuex'
import WordsStore from '@/stores/modules/WordsStore.ts'
import CategoriesStore from '@/stores/modules/CategoriesStore.ts'
import TagsStore from '@/stores/modules/TagsStore.ts'
import TagsColorStore from '@/stores/modules/TagsColorStore.ts'
import ArticlesStore from '@/stores/modules/ArticlesStore.ts'
import WordsGroupsStore from '@/stores/modules/WordsGroupsStore.ts'
import Theme from '@/stores/Theme.ts'
import Screen from '@/stores/Screen.ts'
import Search from '@/stores/Search.ts'
import Views from '@/stores/Views.ts'

const store = new Vuex.Store({
  modules: {
    WordsStore,
    CategoriesStore,
    TagsStore,
    TagsColorStore,
    ArticlesStore,
    WordsGroupsStore,
    Theme,
    Screen,
    Search,
    Views
  }
})

export { store }
