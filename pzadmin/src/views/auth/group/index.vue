<template>
    <div class="container">
    <panel-head :route="route"></panel-head>
    <div class="btns">
        <el-button  size="small" :icon="Plus" type="primary" @click="open(null)">新增</el-button>
    </div>
    <el-table
        :data="tableData.list"
        style="width: 100%;">
        <el-table-column prop="id" label="id"/>
        <el-table-column prop="name" label="呢称"/>
        <el-table-column prop="permissionName" label="菜单权限" width="500px"/>
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
            <el-form-item v-show="false" prop="id">
                <el-input v-model="form.id"/>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请填写权限名称" />
            </el-form-item>
            <el-form-item label="权限" prop="permissions">
                <el-tree
                ref="treeRef"
                style="max-width: 600px;" 
                :data="permissionData"
                node-key="id"
                show-checkbox
                :default-checked-keys="defaultKeys"
                default-expanded-keys="[2]"
                />
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
import { ref, reactive, onMounted, nextTick, handleError } from 'vue'
import { userGetmenu, userSetmenu, menuList } from '../../../api'
import { Plus } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
onMounted(() => {
    userGetmenu().then(({data}) => {
        //console.log(data)
        permissionData.value = data
    })
    getListData()
})
const route = useRoute()
//l列表数据
const tableData = reactive({
    list: [],
    total: 0
})
//
const dialogVisable = ref(false)
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

//打开弹窗
const open = (rowData = {}) => {
    dialogVisable.value = true
    //弹窗打开生成是异步的
    nextTick(() => {
        if(rowData){
            Object.assign(form, {id:rowData.id, name:rowData.name})
            treeRef.value.setCheckedKeys(rowData.permission)
        }
    })
}
//请求列表
const getListData = () => {
    menuList(paginationData).then(({data}) => {
        console.log(data)
        const {list, total} = data
        tableData.list = list
        tableData.total = total
    })
}
//form data
const form = reactive({
    id:'',
    name:'',
    permissions:''
})

// 权限菜单数据
const permissionData = ref([])
const beforeClose = () => {
    dialogVisable.value = false
    formRef.value.resetFields()
    treeRef.value.setCheckedKeys(defaultKeys.value)
}

//
const defaultKeys = ref([4,5])
const treeRef = ref()
const formRef = ref()
const rules = reactive({
    name:[{required: true, trigger: 'blur', message: '请输入权限名称'}]
})
const confirm = async(formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
    if (valid) {
        const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
        userSetmenu({name: form.name, permissions, id: form.id }).then(({data}) => {
           // console.log(data)
        }) 
        beforeClose()
        getListData()   
        } else{
            console.log('error submit', fields)
        }
    })
}
</script>

<style scoped>
.btns{
    padding:10px 0 10px 10px;
    background-color: #fff;
}
</style>