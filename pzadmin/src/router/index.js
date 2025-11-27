import {createRouter, createWebHashHistory} from 'vue-router'
import Layout from '../views/Main.vue'
import Login from '../views/login/index.vue'
import Dashboard from '../views/dashboard/index.vue'

import Admin from '../views/auth/admin/index.vue'
import Group from '../views/auth/group/index.vue'

import Staff from '../views/vppz/staff/index.vue'
import Order from '../views/vppz/order/index.vue'

const routes = [
  { 
    path: '/',
    component: Layout,
    name: 'main',
    redirect: to => {
      const localData = localStorage.getItem('pz_v3pz')
      if(localData){
        const child = JSON.parse(localData).menu.routerList[0].children
        if(child){
          return child[0].meta.path
        } else{
          return JSON.parse(localData).menu.routerList[0].meta.path
        }
      } else{
        return '/login'
      }
    },
    children: []
  },
  {
    path: '/login',
    component: Login
  },
]

const router = createRouter({
    routes,
    history: createWebHashHistory()
})

export default router