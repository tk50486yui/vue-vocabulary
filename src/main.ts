import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/route.ts'
import { store } from '@/stores/store.ts'
import 'ant-design-vue/dist/reset.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import installFontAwesomeIcon from '@/plugins/fontawesome/fontawesome-icon.ts'
import CKEditor from '@ckeditor/ckeditor5-vue'
import {
  globalErrorHandler,
  windowOnError,
  windowErrorListener
} from './libs/errorHandler.ts'
import TreeCategoriesMenu from '@/components/tree-menu/TreeCategoriesMenu.vue'
import TreeTagsMenu from '@/components/tree-menu/TreeTagsMenu.vue'
import * as antIcon from '@/plugins/ant-design/ant-icon.ts'

const app = createApp(App)
app.config.errorHandler = globalErrorHandler
window.onerror = windowOnError
window.addEventListener('error', windowErrorListener)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component('el-' + key, component)
}
Object.keys(antIcon).forEach((key: string) => {
  app.component(key, antIcon[key])
})

app.component('TreeCategoriesMenu', TreeCategoriesMenu)
app.component('TreeTagsMenu', TreeTagsMenu)

app.use(router)
app.use(store)

app.use(ElementPlus)
app.use(CKEditor)

installFontAwesomeIcon(app)

app.mount('#app')
