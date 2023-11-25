import { createRouter, createWebHistory } from 'vue-router'
import WordsAddView from '@/views/WordsAddView.vue'
import WordsView from '@/views/WordsView.vue'
import WordsGridView from '@/views/WordsGridView.vue'
import WordDetailsView from '@/views/WordDetailsView.vue'
import ArticlesView from '@/views/article/ArticlesView.vue'
import ArticlesContentView from '@/views/article/ArticlesContentView.vue'
import WordsGroupsListView from '@/views/wordsgroup/WordsGroupsListView.vue'
import WordsGroupsDetailsView from '@/views/wordsgroup/WordsGroupsDetailsView.vue'
import TagsView from '@/views/tag/TagsView.vue'
import CategoriesView from '@/views/category/CategoriesView.vue'
import WordsUpload from '@/views/shared/WordsUpload.vue'

const routes = [
  {
    path: '',
    name: 'home',
    component: WordsGridView
  },
  {
    path: '/wordsgrid',
    name: 'wordsGrid',
    component: WordsGridView
  },
  {
    path: '/words',
    name: 'words',
    component: WordsView
  },
  {
    path: '/wordsadd',
    name: 'wordsAdd',
    component: WordsAddView
  },
  {
    path: '/word/details/:id',
    name: 'wordDetails',
    component: WordDetailsView
  },
  {
    path: '/articles',
    name: 'articles',
    component: ArticlesView
  },
  {
    path: '/articles/content/:id',
    name: 'articlesContent',
    component: ArticlesContentView
  },
  {
    path: '/tags',
    name: 'tags',
    component: TagsView
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoriesView
  },
  {
    path: '/wordsgroups',
    name: 'wordsGroups',
    component: WordsGroupsListView
  },
  {
    path: '/wordsgroups/details/:id',
    name: 'wordsGroupsDetails',
    component: WordsGroupsDetailsView
  },
  {
    path: '/wordsupload',
    name: 'wordsUpload',
    component: WordsUpload
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
