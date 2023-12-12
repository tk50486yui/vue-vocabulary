import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/route'
import { store } from '@/stores/store'
import 'ant-design-vue/dist/reset.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import CKEditor from '@ckeditor/ckeditor5-vue'
import { windowOnError, windowErrorListener, warningHandler } from './libs/errorHandler'
import TreeCategoriesMenu from '@/components/tree-menu/TreeCategoriesMenu.vue'
import TreeTagsMenu from '@/components/tree-menu/TreeTagsMenu.vue'
import installFontAwesomeIcon from '@/plugins/fontawesome/fontawesome-icon'
import installAntIcon from '@/plugins/ant-design/ant-icon'
import installElIcon from '@/plugins/element-plus/el-icon'

const app = createApp(App)

window.onerror = windowOnError
window.addEventListener('error', windowErrorListener)
app.config.warnHandler = warningHandler

app.component('TreeCategoriesMenu', TreeCategoriesMenu)
app.component('TreeTagsMenu', TreeTagsMenu)

app.use(router)
app.use(store)

app.use(ElementPlus)
app.use(CKEditor)

installAntIcon(app)
installFontAwesomeIcon(app)
installElIcon(app)

app.mount('#app')
