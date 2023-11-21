import { App } from 'vue'
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  CaretDownOutlined,
  StarFilled,
  HeartFilled,
  DeleteFilled,
  DeleteOutlined
} from '@ant-design/icons-vue'

export default function installAntIcon(app: App) {
  app.component('EditOutlined', EditOutlined)
  app.component('CheckOutlined', CheckOutlined)
  app.component('CloseOutlined', CloseOutlined)
  app.component('CaretDownOutlined', CaretDownOutlined)
  app.component('StarFilled', StarFilled)
  app.component('HeartFilled', HeartFilled)
  app.component('DeleteFilled', DeleteFilled)
  app.component('DeleteOutlined', DeleteOutlined)
}
