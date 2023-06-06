import { library } from '@fortawesome/fontawesome-svg-core'
import { faMagnifyingGlass, faBars, faHouse, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faMagnifyingGlass)
library.add(faBars)
library.add(faHouse)
library.add(faChevronRight)

export default function installFontAwesomeIcon (app) {
  app.component('font-awesome-icon', FontAwesomeIcon)
}
