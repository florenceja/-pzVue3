<template>
    <div class="container">
        <panel-head :route="route"/>

        <div class="form">
            <el-form :model="searchForm" inline="true">
                <el-form-item prop="out_trade_no">
                    <el-input v-model="searchForm.out_trade_no" placeholder="请输入订单号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>

            </el-form>
        </div>
        <el-table
            :data="tableData.list"
        >
            <el-table-column prop="out_trade_no" label="订单号" width="150" fixed="left"></el-table-column>
            <el-table-column prop="hospital_name" label="就诊医院"></el-table-column>
            <el-table-column prop="service_name" label="陪诊服务"></el-table-column>
            <el-table-column prop="tableData.companion.name" label="陪护师">
                <template #default="scope">
                    <el-image style="width: 40px; height: 40px" :src="scope.row.companion.avatar" :fit="fit" />
                </template>
            </el-table-column>
            <el-table-column prop="tableData.companion.mobile" label="陪护师手机号" width="120">
                <template #default="scope">{{ scope.row.companion.mobile }}</template>
            </el-table-column>
            <el-table-column prop="price" label="总价"></el-table-column>
            <el-table-column prop="paidPrice" label="已付"></el-table-column>
            <el-table-column prop="order_start_time" label="下单时间" width="120"></el-table-column>
            <el-table-column prop="trade_state" label="订单状态">
                <template #default="scope">
                    <el-tag :type="statusOrder[scope.row.trade_state]">{{ scope.row.trade_state }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="service_state" label="接单状态"></el-table-column>
            <el-table-column prop="tel" label="联系人手机号" width="120"></el-table-column>
            <el-table-column label="操作" fixed="right">
                <template #default="scope">
                    <el-popconfirm 
                        v-if="scope.row.trade_state === '待服务'"
                        title="是否确认完成"
                        confirm-button-text="是"
                        cancel-button-text="否"
                        :icon="InfoFilled"

                        @confirm="confirmDone(scope.row.out_trade_no)" >
                        <template #reference>
                            <el-button type="primary" link>服务完成</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button v-else type="primary" link disabled>暂无服务</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-info">
            <el-pagination 
                :currentPage="paginationData.pageNum" 
                :page-size="paginationData.pageSize"
                :background="false"
                layout="total, prev, pager, next"
                size="small"
                :total="tableData.total"
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange"/>
        </div>

    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { adminOrder, updateOrder } from '../../../api';
import { onMounted, reactive } from 'vue';
import dayjs from 'dayjs'
import { InfoFilled, Right } from '@element-plus/icons-vue';
const route = useRoute()
//列表搜索参数
const searchForm = reactive({
    out_trade_no:''
})
//列表参数
const paginationData = reactive({
    pageNum:1,
    pageSize:10
})

//列表方法
const handleSizeChange = (val) => {
    paginationData.pageSize = val
    getListData()

}
const handleCurrentChange = (val) => {
    paginationData.pageNum = val
    getListData()
}

//表格数据
const tableData = reactive({
    list:[],
    total:0
})

//获取表格数据
const getListData = (params = {}) => {
    adminOrder({...paginationData, ...params}).then(({data}) => {
        const {list, total} = data
        list.forEach(element => {
            element.order_start_time = dayjs(element.order_start_time).format('YYYY-MM-DD')
        });
        console.log(data)
        tableData.list = list
        tableData.total = total
        console.log(tableData)
    })
}
onMounted(() => {
    getListData()
})

//接单状态type值
const statusOrder = {
    '待服务': 'primary',
    '已取消': 'info',
    '已完成': 'success',
    '待支付': 'warning'
}

//搜索方法
const onSubmit = () => {
    getListData(searchForm)
}

//服务完成
const confirmDone = (id) => {
    updateOrder({ id }).then(() => {
        getListData()
    })
}
</script>


<style lang="less" scoped>
.form{
    display: flex;
    justify-content: flex-end;
    padding: 10px 0 10px 10px;
    background-color: #fff;
}

</style>