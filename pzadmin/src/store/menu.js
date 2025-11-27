const localData = localStorage.getItem('pz_v3pz')
const state = localData ? localData.menu : {
    isCollapse : false,
    selectMenu : [],
    routerList:[],
    menuActive:'1-1'
}

const mutations = {
    collapseMenu(state){
        state.isCollapse = !state.isCollapse
    },
    addMenu(state, payload){
        if(state.selectMenu.findIndex(item => item === payload) === -1){
            state.selectMenu.push(payload)
        }
    },
    closeMenu(state, payload){
        const index = state.selectMenu.findIndex(val => val.name === payload.name)
        state.selectMenu.splice(index,1)
    },
    dynamicMenu(state, payload){
        const modules = import.meta.glob('../views/**/**/*.vue')
        function routerReset(route){
            route.forEach(element => {
            if(!element.children){
                const url = `../views${element.meta.path}/index.vue`
                element.component = modules[url]
            } else{
                routerReset(element.children)
            }
        })
        }
        routerReset(payload)
        state.routerList = payload
        //console.log(state.routerList)
    },
    updateActive(state,payload){
        state.menuActive = payload
        console.log(state.menuActive)
    }
}

export default {
    state,
    mutations
}