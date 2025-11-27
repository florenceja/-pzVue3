import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'
import router from './router'
import api from './api'

router.beforeEach((to, from) => {
  const token = localStorage.getItem('h5_token')
  if(!token && to.path !== '/login'){
    return '/login'
  } else if(token && to.path === '/login'){
    return '/'
  } else{
    return true
  }
})
const app = createApp(App)
app.config.globalProperties.$api = api
app.use(router)

app.mount('#app')

