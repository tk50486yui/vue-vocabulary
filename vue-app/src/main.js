import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/route.js'
import { store } from '@/stores/store.js'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import axios from 'axios'

store.$axios = axios
store.$api = 'http://localhost/git/SlimProject/api/public'

const app = createApp(App)
app.config.devtools = true
app.config.errorHandler = (error, vm, info) => {
  console.error('main.js捕捉到全局錯誤:', error)
  console.error('錯誤詳細:', info)
}
window.addEventListener('error', function onError (e) {
  console.log('window')
  // Ignore ResizeObserver error
  if (e.message === 'ResizeObserver loop limit exceeded') {
    console.log('window in ResizeObserver loop limit exceeded')
    e.stopPropagation()
    e.stopImmediatePropagation()
  }
  if (e.message === 'ResizeObserver loop completed with undelivered notifications') {
    console.log('window in ResizeObserver loop completed with undelivered notifications')
    e.stopPropagation()
    e.stopImmediatePropagation()
  }
})

app.use(Antd)
app.use(router)
app.use(store)

app.mount('#app')
