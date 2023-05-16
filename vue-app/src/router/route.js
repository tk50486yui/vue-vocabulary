import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import WordsView from '@/views/WordsView.vue'
import ErrorView from '@/views/ErrorView.vue'
import UserView from '@/components/User.vue'
import Postiew from '@/components/PostUser.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
    /* components: {
      default: HomeView,
      home: HomeView
    } */
  },
  {
    path: '/error',
    name: 'error',
    component: ErrorView
  },
  {
    path: '/words',
    name: 'words',
    component: WordsView
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
