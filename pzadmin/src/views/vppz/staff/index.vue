<template>
    <div class="container">

        <div class="btns">
            <el-button  size="small" :icon="Plus" type="primary" @click="open(null)">新增</el-button>
            <el-popconfirm 
                title="您确定要删除吗?"
                confirm-button-text="是"
                cancel-button-text="否"
                :icon="InfoFilled"
                @confirm="handleDelete" >
                <template #reference>
                    <el-button :icon="Delete" type="danger" size="small">删除</el-button>
                </template>
            </el-popconfirm>
        </div>

        <el-table :data="tableData.list" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" :selectable="selectable" width="55" />
            <el-table-column prop="id" label="id" />
            <el-table-column prop="name" label="昵称" />
            <el-table-column prop="avatar" label="头像">
                <template #default="scope">
                    <el-image style="width: 50px; height: 50px" :src="scope.row.avatar" />
                </template>
            </el-table-column>
            <el-table-column prop="sex" label="性别" >
                <template #default="scope">
                    {{ scope.row.sex === '2' ? '女' : '男' }}
                </template>
            </el-table-column>
            <el-table-column prop="mobile" label="手机号" />
            <el-table-column prop="active" label="状态" >
                <template #default="scope">
                    <el-tag :type="scope.row.active === 1 ? 'success' : 'danger' ">{{ scope.row.active === 1 ? '生效' : '失效' }}</el-tag>
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
            <el-table-column label="操作" >
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
            title="添加陪护师"
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
                <el-form-item label="昵称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入昵称"/>
                </el-form-item>
                <el-form-item label="头像" prop="avatar" @click="uploadAvatar">
                    <el-button v-if="!form.avatar" v-model="form.avatar" type="primary">点击上传</el-button>
                    <el-image v-else style="width: 100px; height: 100px" :src="form.avatar" :fit="fit" />
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select v-model="form.sex" placeholder="请选择性别" style="width: 240px;">
                        <el-option label="男" value="1"/>
                        <el-option label="女" value="2"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input-number v-model="form.age" :min="18" :max="55" />
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="form.mobile" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="是否生效" prop="active">
                    <el-radio-group v-model="form.active">
                        <el-radio :value="0">失效</el-radio>
                        <el-radio :value="1">生效</el-radio>
                    </el-radio-group>
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
        <el-dialog v-model="dialogImgVisible" title="陪护师头像上传" width="680" :before-close="beforeImgClose">
            <div class="image-list">
                <div v-for="(item, index) in imgList" class="img-box" :key = item.name @click="selectedIndex = index">
                    <div v-if="index === selectedIndex" class="select">
                        <el-icon color="#fff"><Check /></el-icon>
                    </div>
                    <el-image style="width: 148px; height: 148px" :src="item.url"/>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button  @click="dialogImgVisible = false">
                    取消
                    </el-button>
                    <el-button type="primary" @click="confirmImg()">
                    确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
        
    </div>

</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import {  Plus } from '@element-plus/icons-vue'
import { Check } from '@element-plus/icons-vue'
import { Delete } from '@element-plus/icons-vue'
import { InfoFilled } from '@element-plus/icons-vue'

import dayjs from 'dayjs'

import { photoList, companion, companionList, deleteCompanion } from '../../../api'
import { ElMessage } from 'element-plus'

onMounted(() => {
    photoList().then(({data}) => {
        //console.log(data)
        imgList.value = data
        //console.log(imgList.value)

    })
    getListData()
})

const selectDelData = ref([])
const handleSelectionChange = (val) => {
    selectDelData.value = val.map(item => ({id: item.id}))

}
const handleDelete = () => {
    if(!selectDelData.value.length){
        return ElMessage.warning('请选择至少一项数据')
    }
    deleteCompanion({id:selectDelData.value}).then((data) => {
        //console.log(data)
        getListData()
    })
}
const paginationData = reactive({
    pageNum:1,
    pageSize:10
})
const handleSizeChange = (val) => {
    paginationData.pageSize = val
    getListData()

}
const handleCurrentChange = (val) => {
    paginationData.pageNum = val
    getListData()
}

const tableData = reactive({
    list:[],
    total:0
})
const getListData = () => {
    companionList(paginationData).then(({data}) => {
        const {list, total} = data
        list.forEach(element => {
            element.create_time = dayjs(element.create_time).format('YYYY-MM-DD')
        });
        tableData.list = list
        tableData.total = total
        console.log(tableData)
    })
}
const dialogVisable = ref(false)
const form = reactive(
    {
        "id": 0,
        "mobile": '',
        "active": 1,
        "age": 20,
        "avatar": '',
        "name": '',
        "sex": ''
    }
)
const formRef = ref()

const beforeClose = () =>{
    dialogVisable.value = false
    formRef.value.resetFields()
}
const rules = reactive({
    name:[{required: true, trigger:'blur', message: '请输入昵称'}],
    avatar:[{required: true, message: '请选择头像'}],
    sex:[{required: true, trigger:'change', message: '请选择性别'}],
    mobile:[{required: true, trigger:'blur', message: '请填写手机号'}],
})
const open = ( rowData = {} ) => {
    dialogVisable.value = true
    nextTick(() => {
        if(rowData){
            Object.assign(form, rowData)
        }
    })
}

const confirm = async(formEl) => {
    if(!formEl) return
    await formEl.validate((valid, fields) => {
        if(valid){
            companion(form).then((data) => {
                console.log(data)
                beforeClose()
                getListData()
            })
            
        } else{
            console.log('error submit', fields)
        }
    })
}
//陪护师头像列表
const imgList = ref([])
//陪护师上传头像弹窗打开与关闭
const dialogImgVisible = ref(false)
//陪护师上传头像弹窗关闭方法
const beforeImgClose = () => {
    dialogImgVisible.value = false

}
const uploadAvatar = () => {
    dialogImgVisible.value = true
}

//选中图片
const selectedIndex = ref(0)

const confirmImg = () => {
    form.avatar = imgList.value[selectedIndex.value].url
    dialogImgVisible.value = false
}
</script>

<style lang="less" scoped>
.btns {
    padding: 10px 0 10px 10px;
    background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>