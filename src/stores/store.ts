import Vuex from 'vuex'
import { RootState } from '@/interfaces/RootState'
import WordsStore from '@/stores/modules/WordsStore'
import CategoriesStore from '@/stores/modules/CategoriesStore'
import TagsStore from '@/stores/modules/TagsStore'
import TagsColorStore from '@/stores/modules/TagsColorStore'
import ArticlesStore from '@/stores/modules/ArticlesStore'
import WordsGroupsStore from '@/stores/modules/WordsGroupsStore'
import Theme from '@/stores/Theme'
import Screen from '@/stores/Screen'
import Search from '@/stores/Search'
import Views from '@/stores/Views'

const store = new Vuex.Store<RootState>({
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
