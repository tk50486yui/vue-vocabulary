import { App } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faMagnifyingGlass,
  faBars,
  faHouse,
  faXmark,
  faPalette,
  faChevronRight,
  faPlus,
  faFilter,
  faChevronLeft,
  faSort,
  faGear
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faMagnifyingGlass)
library.add(faBars)
library.add(faHouse)
library.add(faChevronRight)
library.add(faPlus)
library.add(faFilter)
library.add(faChevronLeft)
library.add(faSort)
library.add(faXmark)
library.add(faPalette)
library.add(faGear)

export default function installFontAwesomeIcon(app: App) {
  app.component('font-awesome-icon', FontAwesomeIcon)
}
