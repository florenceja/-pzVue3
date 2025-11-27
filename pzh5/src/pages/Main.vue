<template>
  
  <div>
    <routerView />
    <van-tabbar v-model="active">
        <van-tabbar-item v-for="(item, index) in router.options.routes[0].children" :key="item.path" :icon="item.meta.icon"  @click="goNext(index)">{{ item.meta.name }}</van-tabbar-item>
    </van-tabbar>

  </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const active = ref(0)
onMounted(() => {
    console.log(router)
    console.log(route)
    active.value = router.options.routes[0].children.findIndex(item => '/' + item.path === route.path)
})

const goNext = (index) => {
  //console.log(path)
  //console.log(router.options.routes[0].children[active])
  router.push(router.options.routes[0].children[index].path)
}
</script>


<style scoped>
</style>