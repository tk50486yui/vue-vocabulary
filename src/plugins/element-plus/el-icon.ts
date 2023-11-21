import { App } from 'vue'
import { CircleCloseFilled, Moon, Sunny } from '@element-plus/icons-vue'

export default function installElIcon(app: App) {
  app.component('el-CircleCloseFilled', CircleCloseFilled)
  app.component('el-Moon', Moon)
  app.component('el-Sunny', Sunny)
}
