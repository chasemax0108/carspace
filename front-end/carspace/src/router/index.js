import Vue from 'vue'
import VueRouter from 'vue-router'
import MyCars from '../views/MyCars.vue'
import Parts from '../views/Parts.vue'

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
  }
]

const router = new VueRouter({
  routes
})

export default router
