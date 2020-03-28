import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login.vue'
import Home from '../views/home.vue'
import Nssi from '../views/nssi.vue'
import NsstDesign from '../views/nsst_design.vue'
import NsstRuntime from '../views/nsst_runtime.vue'
import Script from '../views/script.vue'
import Fm from '../views/fm.vue'
import Pm from '../views/pm.vue'
import Profile from '../views/profile.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [
      { path: '/', redirect: '/nssi' },
      { path: '/nssi', component: Nssi },
      { path: '/nsst_design', component: NsstDesign },
      { path: '/nsst_runtime', component: NsstRuntime },
      { path: '/script', component: Script },
      { path: '/fm', component: Fm },
      { path: '/pm', component: Pm },
      { path: '/profile', component: Profile }
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
