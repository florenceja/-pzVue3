<template>
    <div class="container">
        <panel-head :route="route"/>
        <el-table
            :data="tableData.list"
            style="width: 100%;">
            <el-table-column prop="id" label="id"/>
            <el-table-column prop="name" label="呢称"/>
            <el-table-column prop="permissions_id" label="所属组别">
                <template #default="scope">
                    {{ permissionName(scope.row.permissions_id) }}
                </template>
            </el-table-column>
            <el-table-column prop="mobile" label="手机号"/>
            <el-table-column prop="active" label="状态">
                <template #default="scope">
                    <el-tag class="ml-2" :type=" scope.row.active ? 'success' : 'danger'">
                        {{ scope.row.active ? '正常' : '失效' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" >
                <template #default="scope">
                    <div class="flex-box">
                        <el-icon><Clock /></el-icon>
                        <span style="margin-left: 10px;">{{ scope.row.create_time }}</span>
                    </div>
                </template>
                
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" @click="open(scope.row)">编辑</el-button>
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
        <el-dialog
            v-model="dialogVisable"
            :before-close="beforeClose"
            title="添加权限"
            width="500">

            <el-form
                ref="formRef"
                label-width="100px"
                label-position="left"
                :model="form"
                :rules="rules">
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="form.mobile" disabled />
                </el-form-item>
                <el-form-item label="昵称" prop="name">
                    <el-input v-model="form.name" />
                </el-form-item>

                <el-form-item label="菜单权限" prop="permission_id">
                    <el-select v-model="form.permissions_id" placeholder="请选择菜单权限" style="width: 240px;">
                        <el-option
                            v-for="item in options"
                            :key="item.id" 
                            :label="item.name"
                            :value="item.id"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="confirm(formRef)">
                    确认
                    </el-button>
                </div>
            </template>
        </el-dialog>

    </div>
</template>

<script setup>
import { authAdmin, menuSelectList, updateUser } from '../../../api';
import { ref, reactive, onMounted, nextTick } from 'vue';
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'

const route = useRoute()

//对话框
const dialogVisable = ref(false)
//对话框表单数据
const form = reactive({
    name: '',
    permissions_id:0

})
//表格数据
const tableData = reactive({
    list:[],
    total:0
})

//分页器
const paginationData = reactive({
    pageNum: 1,
    pageSize: 10
})
const handleSizeChange = (val) => {
    paginationData.pageSize = val
    getListData()

}
const handleCurrentChange = (val) => {
    paginationData.pageNum = val
    getListData()
}

//表格数据
const getListData= () => {
        authAdmin(paginationData).then(({data}) => {
            //console.log(data)
            const list = data.list
            list.forEach(element => {
                element.create_time = dayjs(element.create_time).format('YYYY-MM-DD')
            });
            tableData.list = list
            tableData.total = data.total

            //console.log(tableData)
        })
}

//菜单权限
const options = ref([])
const permissionName = (id) => {
    //console.log('当前用户的 permission_id：', id, '类型：', typeof id);
    //console.log('所有权限选项：', options.value); // 看 options 里的 id 类型和值
    
    // 统一类型后匹配（避免数字/字符串不匹配）
    const targetId = Number(id);
    const matchedItem = options.value.find(el => Number(el.id) === targetId);
    
    //console.log('匹配到的权限项：', matchedItem);
    return matchedItem ? matchedItem.name : '超级管理员';

}
onMounted(() => {
    getListData()
    menuSelectList().then(({data}) => {
        options.value = data
    })
})

//新增或编辑
const open = (rowData = {}) => {
    dialogVisable.value = true
    Object.assign(form, {mobile:rowData.mobile, name:rowData.name, permissions_id:rowData.permissions_id})
}

//对话框关闭
const beforeClose = () => {
    dialogVisable.value = false
    formRef.value.resetFields()
}
const rules = reactive({
    name:[{required: true, trigger: 'blur', message: '请输入昵称'}]
})
const formRef = ref()
const confirm = async(formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
    if (valid) {
        //console.log(options.value)
        updateUser({name: form.name, permissions_id: form.permissions_id }).then(({data}) => {
           console.log(data)
        }) 
        //console.log(options)
        beforeClose()
        getListData()   
        } else{
            console.log('error submit', fields)
        }
    })
}
</script>

<style lang="less" scoped>
.flex-box{
    display: flex;
    align-items: center;
}
</style>