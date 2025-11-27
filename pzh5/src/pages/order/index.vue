
<template>
  <div class="container">
    <div class="header">我的订单</div>

    <van-tabs @click-tab="onClickTab"  v-model:active="activeName">
      <van-tab title="全部" name=""/>
      <van-tab title="待支付" name="1"/>
      <van-tab title="待服务" name="2"/>
      <van-tab title="已完成" name="3"/>
      <van-tab title="已取消" name="4"/>
    </van-tabs>

    <van-row v-for="item in listData" :key="item.out_trade_no" @click="goDetail(item)">
      <van-col span="5">
        <van-image width="50" height="50" :src="item.serviceImg"></van-image>
      </van-col>
      <van-col span="14">
        <div class="text1">{{ item.service_name }}</div>
        <div class="text2">{{ item.hospital_name }}</div>
        <div class="text2">{{ '预约时间：'+item.starttime }}</div>
      </van-col>
      <van-col span="5" :style="{ color: colorMap[item.trade_state]}">
        {{ item.trade_state }}
        <counter v-if="item.trade_state === '待支付'" :second="item.timer"/>
      </van-col>

    </van-row>
    <div class="bottom_text">没有更多了</div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, reactive } from 'vue'
import couter from '../../components/counter.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { proxy } = getCurrentInstance()

const activeName = ref("")
onMounted(() => {
  getListData('')
})
//定义列表数据
const listData = ref([])
//获取列表数据
const getListData = async (state) => {
  const res = await proxy.$api.orderList( {state} )
  console.log(res)
  res.data.data.forEach(element => {
    element.timer = element.order_start_time + 7200000 - Date.now()
  });
  if(res.data.code === 10000){
    Object.assign(listData.value, res.data.data)
    //console.log(listData.value)
  }
}

const onClickTab = (item) => {
  //console.log(item)
  getListData(item.name)
}

const colorMap = {
  '待支付': '#ffa200',
  '待服务': '#1da6fd',
  '已完成': '#21c521'
}

//点击跳转详情页
const goDetail = (item) => {
  router.push(`/detail?oid=${item.out_trade_no}`)
}
</script>


<style lang="less" scoped>
.container {
    background-color: #f0f0f0;
    height: 100vh;
  }
  .header {
    background-color: #fff;
    line-height: 40px;
    text-align: center;
  }
  .van-row {
    background-color: #fff;
    padding: 10px;
    margin: 5px;
    border-radius: 5px;
    .text1 {
      font-size: 16px;
      line-height: 25px;
      font-weight: bold;
    }
    .text2 {
      font-size: 14px;
      line-height: 20px;
      color: #999999;
    }
  }
  .bottom-text {
    line-height: 50px;
    text-align: center;
    color: #999999;
  }
</style>