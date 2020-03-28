import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

Vue.use(ElementUI)
Vue.use(VueAxios, axios)

library.add(fas, far, fab)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

Vue.config.productionTip = false

var vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// Axios initialization
axios.delete.withCredentials = false
// axios.defaults.headers.common.accessToken = undefined
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.interceptors.request.use(config => {
  const token = window.sessionStorage.getItem('token')
  if (token) {
    config.headers.common.accessToken = token
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  console.log(response.data)
  return response
}, error => {
  switch (error.response.status) {
    case 401: invalidSession()
  }
  return Promise.reject(error)
})

function invalidSession () {
  vm.$alert('登录过期，请重新登录！', ' 登录过期', {
    confirmButtonText: '确定',
    type: 'warning',
    callback: () => {
      router.push('/login')
    }
  })
}

export default vm
