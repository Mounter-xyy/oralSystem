import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import ElementUI from 'element-ui'
import VueMoment from 'vue-moment'
import VueResource from 'vue-resource'
import 'element-ui/lib/theme-chalk/index.css'
import $ from 'jquery'
window.$=$
import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import quillEditor from 'vue-quill-editor' //调用编辑器
 
import axios from 'axios';


axios.defaults.withCredentials=true;


Vue.use(VueMoment)
Vue.use(VueResource)
Vue.use(ElementUI)
Vue.use(quillEditor)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
