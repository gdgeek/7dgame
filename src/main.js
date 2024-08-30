import Vue from 'vue'
import 'babel-polyfill'
import VueCookies from 'vue-cookies'

import ability from './ability'
import VueForm from '@lljj/vue-json-schema-form'
import VueIframe from 'vue-iframes'
import vueHljs from 'vue-hljs'
import hljs from 'highlight.js'
// if you want to use default color, import this css file
import 'vue-hljs/dist/style.css'

import './plugins/fontawesome'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import VueCropper from 'vue-cropper' // head icon upload

Vue.use(VueIframe)
// cookies

Vue.use(VueCookies)
Vue.$cookies.config('7d')

// highlight

Vue.use(vueHljs, { hljs })

// set head icon upload
Vue.use(VueCropper)

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.component('VueForm', VueForm)
new Vue({
  el: '#app',
  router,
  store,
  ability,
  render: h => h(App)
})
