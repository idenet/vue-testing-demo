import Vue from 'vue'
import VueRouter from 'vue-router'
import todosApp from '../components/todos/todosApp.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: todosApp
  },
  {
    path: '/active',
    component: todosApp
  },
  {
    path: '/completed',
    component: todosApp
  }
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'selected'
})

export default router
