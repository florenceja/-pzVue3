<template>
  <!-- 第二行：本身语法没问题，保持不变 -->
  <div class="container">
    <template v-for="(item) in props.menuData" >
    
      <el-menu-item @click="handleClick(item, `${props.index}-${item.meta.id}`)"
        v-if="!item.children || item.children.length === 0" 
        :index="`${props.index}-${item.meta.id}`" 
        :key="`${props.index}-${item.meta.id}`"
      >
        <el-icon size="20">
          <component :is="item.meta?.icon"></component>
        </el-icon>
        <span>{{ item.meta?.name }}</span>
      </el-menu-item>

      <el-sub-menu 
        v-else 
        :index="`${props.index}-${item.meta.id}`"
        :key="`${props.index}-${item.meta.id}`"
        
      >
        <template #title>
          <el-icon size="20">
            <component :is="item.meta?.icon"></component>
          </el-icon>
          <span>{{ item.meta?.name }}</span>
        </template>
        <tree-menu 
          :index="`${props.index}-${item.meta.id}`" 
          :menuData="item.children" 
        ></tree-menu>
      </el-sub-menu>
    </template>
  </div>
</template>

<script setup name="TreeMenu">  
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed } from 'vue';

const props = defineProps(['menuData', 'index'])
const router = useRouter()
const store = useStore()
const handleClick = (item, active) => {
  router.push(item.meta.path)
  store.commit('addMenu', item.meta)
  store.commit('updateActive', active)
  //console.log(active)
}
</script>

<style scoped>
</style>