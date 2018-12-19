import DefaultLayout from '~/layouts/Default.vue'
import VueHighlightJS from 'vue-highlightjs'

export default function (Vue) {
  Vue.component('Layout', DefaultLayout)
  Vue.use(VueHighlightJS)
}
