import Vue from 'vue'
import VueRouter from 'vue-router'
import MyCars from '../views/MyCars.vue'
import Parts from '../views/Parts.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'MyCars',
    component: MyCars
  },
  {
    path: '/parts',
    name: 'Parts',
    component: Parts
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

export default router
