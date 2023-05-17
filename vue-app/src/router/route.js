import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import WordsView from '@/views/WordsView.vue'
import ErrorView from '@/views/ErrorView.vue'
import SuccessView from '@/views/SuccessView.vue'
import UserView from '@/components/User.vue'
import Postiew from '@/components/PostUser.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      {
        path: 'error',
        name: 'home-error',
        components: {
          'home-error': ErrorView
        },
        meta: {
          code: 409
        }
      }
    ]
    /* components: {
      default: HomeView,
      home: HomeView
    } */
  },
  {
    path: '/error2',
    name: 'error',
    component: ErrorView
  },
  {
    path: '/success',
    name: 'success',
    component: SuccessView
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
