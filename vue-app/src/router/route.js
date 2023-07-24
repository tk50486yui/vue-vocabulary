import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import WordsView from '@/views/WordsView.vue'
import WordsGridView from '@/views/WordsGridView.vue'
import WordDetailsView from '@/views/WordDetailsView.vue'
import ArticlesView from '@/views/ArticlesView.vue'
import ArticlesContentView from '@/views/ArticlesContentView.vue'
import WordsGroupsView from '@/views/WordsGroupsView.vue'
import WordsGroupsListView from '@/views/WordsGroupsListView.vue'
import WordsGroupsDetailsView from '@/views/WordsGroupsDetailsView.vue'
import TagsView from '@/views/TagsView'
import CategoriesView from '@/views/CategoriesView.vue'
import UserView from '@/components/User.vue'
import Postiew from '@/components/PostUser.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
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
    component: WordsGroupsView
  },
  {
    path: '/wordsgroups/list',
    name: 'wordsGroupsList',
    component: WordsGroupsListView
  },
  {
    path: '/wordsgroups/details/:id',
    name: 'wordsGroupsDetails',
    component: WordsGroupsDetailsView
  },
  {
    path: '/words',
    name: 'words',
    component: WordsView
  },
  {
    path: '/wordsgrid',
    name: 'wordsGrid',
    component: WordsGridView
  },
  {
    path: '/word/details/:id',
    name: 'wordDetails',
    component: WordDetailsView
  },
  {
    path: '/words/category/:cateID',
    name: 'wordsByCateID',
    component: WordsView
  },
  {
    path: '/users/:id',
    name: 'users',
    component: UserView,
    children: [
      {
        name: 'postsChild',
        path: 'posts',
        component: Postiew
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
