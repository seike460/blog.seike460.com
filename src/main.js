import DefaultLayout from '~/layouts/Default.vue'
import VueHighlightJS from 'vue-highlightjs'

export default function (Vue, { head, router, isServer }) {
  Vue.component('Layout', DefaultLayout)
  Vue.use(VueHighlightJS)
  head.script.push({
    type: 'text/javascript',
    src: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/highlight.min.js'
  })
  head.script.push({
    type: 'text/javascript',
    src: '//www.googletagmanager.com/gtag/js?id=UA-89624770-3'
  })
  head.link.push({
    rel: 'stylesheet',
    src: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/styles/monokai-sublime.min.css'
  })
  head.script.push({
    type: 'text/javascript',
    innerHTML: 'window.onload = function() {hljs.initHighlightingOnLoad();}'
  })
  head.script.push({
    type: 'text/javascript',
    innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-89624770-3');`
  })
}
