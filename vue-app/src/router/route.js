import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import UserView from '@/components/User.vue'
import Postiew from '@/components/PostUser.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about2',
    name: 'about',
    component: AboutView
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
