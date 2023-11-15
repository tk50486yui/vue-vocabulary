import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/route.js'
import { store } from '@/stores/store.js'
import axios from 'axios'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import installFontAwesomeIcon from '@/plugins/fontawesome/fontawesome-icon.js'
import CKEditor from '@ckeditor/ckeditor5-vue'
import { globalErrorHandler, windowOnError, windowErrorListener } from './libs/errorHandler.js'

store.$axios = axios

const app = createApp(App)
app.config.devtools = true
app.config.errorHandler = globalErrorHandler
window.onerror = windowOnError
window.addEventListener('error', windowErrorListener)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component('el-' + key, component)
}

app.use(Antd)
app.use(ElementPlus)
app.use(router)
app.use(store)
app.use(CKEditor)

installFontAwesomeIcon(app)

app.mount('#app')
