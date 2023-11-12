import { library } from '@fortawesome/fontawesome-svg-core'
import { faMagnifyingGlass, faBars, faHouse, faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faMagnifyingGlass)
library.add(faBars)
library.add(faHouse)
library.add(faChevronRight)
library.add(faPlus)

export default function installFontAwesomeIcon (app) {
  app.component('font-awesome-icon', FontAwesomeIcon)
}
