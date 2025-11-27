<template>
  <div class="container">
    <div class="header">
      <van-icon name="arrow-left" @click="goBack" class="header-left" size="30"></van-icon>
      填写服务订单
    </div>
    <status-bar :item="stateMap[listData.trade_state]"/>

    <div class="tips">
      <div class="dzf" v-if="listData.trade_state==='待支付'">
        <div class="text1">订单待支付</div>
        <div class="text2">
          请在<counter :second="second" style="display: inline;"/>内完成支付,超时订单自动取消
        </div>
        <div class="text3">
          <van-button @click="showCode=true" type="success">立即支付</van-button>
        </div>
      </div>
      <div class="dzf" v-if="listData.trade_state==='待服务'">
        <div class="text1">正在为您安排服务专员</div>
        <div class="text2">请保持手机畅通,稍后将有服务专员与您联系</div>
      </div>
      <div class="dzf" v-if="listData.trade_state==='已完成'">
        <div class="text1">服务已完成</div>
        <div class="text2">感谢您的使用,如有售后问题请联系客服</div>
      </div>
      <div class="dzf" v-if="listData.trade_state==='已取消'">
        <div class="text1">订单已取消</div>
        <div class="text2">期待下次为您服务,如需帮助可咨询客服</div>
      </div>
    </div>

    <van-cell-group class="card">
      <div class="header-text">
        预约信息
      </div>
      <van-cell 
        v-for="(item, index) in cardOneInfo" 
        :key="index"
        :title="item"
        :value="formatData(index)">
      </van-cell>
    </van-cell-group>

    <van-cell-group class="card">
      <div class="header-text">
        订单信息
      </div>
      <van-cell 
        v-for="(item, index) in cardTwoInfo" 
        :key="index"
        :title="item"
        :value="formatData(index)">
      </van-cell>
    </van-cell-group>


    <!-- 支付弹窗 -->
     <van-dialog v-model:show="showCode" :show-confirm-button="false" >
        <van-icon name="cross" @click="close" class="close" />
        <div>微信支付</div>
        <van-image :src="codeImg" width="150" height="150"></van-image>
        <div>请使用本人微信扫描二维码</div>
      </van-dialog>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import statusBar from '../../components/statusBar.vue'
import { ref, onMounted,getCurrentInstance, reactive, computed } from 'vue'
import counter from '../../components/counter.vue'
import Qrcode from 'qrcode'

const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const goBack = () => {
  router.go(-1)
}

//订单详情数据
const listData = reactive({})
onMounted( async () => {
  //console.log(route)
  const data = await proxy.$api.orderDetail({oid :  route.query.oid})
  //console.log(data)
  Object.assign(listData, data.data.data)
  Qrcode.toDataURL(listData.code_url).then(url => {
    codeImg.value = url
  })
  console.log(listData)
})

//进度条更新
const stateMap = reactive({
  '待支付':10,
  '待服务':20,
  '已完成':30
})

//计算倒计时
const second = computed(() => {
  return listData.order_start_time ? listData.order_start_time + 7200000 - Date.now() : 0
})

//支付弹窗
const showCode = ref(false)
const codeImg = ref("")
const close = () => {
  showCode.value = false
  router.push('/order')
}

//卡片1信息
const cardOneInfo = {
  service_name: '预约服务',
  hospital_name: '就诊医院',
  starttime: '期望就诊时间',
  'client.name': '就诊人',
  'client.mobile': '就诊人电话',
  receiveAddress: '接送地址',
  demand: '其他需求'
}

//卡片二信息
const cardTwoInfo = {
  tel: '联系电话',
  order_start_time: '下单时间',
  price: '应付金额',
  'client.name': '就诊人',
  out_trade_no: '订单编号'
}
//对列表数据进行封装
const formatData = (index) => {
  console.log(index)
 // return listData[index]
  if(index.indexOf(".") !== -1){
    //console.log(1)
    let arr = index.split('.').reduce((o, p) => {
      return (o || {})[p]
    }, listData)
    return arr
  }else{
    if(index === "order_start_time"){
      formatTime(listData[index])
    }
    return listData[index]
  }
}

const formatTime = (time) => {
  const date = new Date(time)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
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
    .header-left {
      float: left;
      
    }
  }
  .card {
    margin: 15px 0;
    padding: 10px;
    .header-text {
      padding-left: 5px;
      line-height: 30px;
      font-size: 16px;
      font-weight: bold;
      border-left: 4px solid red;
    }
  }
  .dzf {
    padding: 20px;
    .text1 {
      font-size: 20px;
      font-weight: bold;
      line-height: 30px;
      color: #666;
    }
    .text2 {
      font-size: 14px;
      color: #666;
    }
    .text3 {
      text-align: center;
      .van-button {
        margin-top: 10px;
        margin-left: 10px;
        width: 80%;
        font-weight: bold;
      }
    }
  }
  ::v-deep(.van-dialog__content) {
    text-align: center;
    padding: 20px;
    .close {
      position: absolute;
      left: 20px;
    }
  }
</style>