import DefaultLayout from '~/layouts/Default.vue'
import VueHighlightJS from 'vue-highlightjs'

export default function (Vue, { head, router, isServer }) {
  Vue.component('Layout', DefaultLayout)
  Vue.use(VueHighlightJS)
  head.script.push({
    type: 'text/javascript',
    src: 'https://www.googletagmanager.com/gtag/js?id=UA-89624770-3'
  })
}
