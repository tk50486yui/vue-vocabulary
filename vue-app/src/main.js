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
app.use(Antd)
app.use(router)
app.use(store)

app.mount('#app')
