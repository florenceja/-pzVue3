import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'

router.beforeEach((to, from) => {
  const token = localStorage.getItem('pz_token')
  if(!token && to.path !== '/login'){
    return '/login'
  } else if(token && to.path === '/login'){
    return '/'
  } else{
    return true
  }
})
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import PanelHead from './components/panelHead.vue'

const localData = localStorage.getItem('pz_v3pz')
if(localData){
  store.commit('dynamicMenu', JSON.parse(localData).menu.routerList)
  store.state.menu.routerList.forEach((item) => {
    router.addRoute('main', item)
  })
}
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('PanelHead', PanelHead)
app.use(router)
app.use(store)
app.mount('#app')
