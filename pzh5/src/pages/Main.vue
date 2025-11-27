<template>
  
  <div>
    <routerView />
    <van-tabbar v-model="active">
        <van-tabbar-item v-for="item in router.options.routes[0].children" :key="item.path" :icon="item.meta.icon">{{ item.meta.name }}</van-tabbar-item>
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
    active.value = router.options.routes[0].children.findIndex(item => '/' + item.path === route.path)
})
</script>


<style scoped>
</style>