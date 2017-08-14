import { controler, child } from './directive/switch-display'

const install = (Vue, config = {}) => {
  if (install.installed) return
  Vue.directive('switch-display-controler', controler)
  Vue.directive('switch-display-child', child)
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default install
