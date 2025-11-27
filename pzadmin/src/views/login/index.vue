<template>
    <el-row class="login-container" justify="center" align="middle">
        <el-card style="max-width: 480px ">
            <template #header>
                <div class="card-header">
                    <img :src="imgUrl" alt="">
                </div>
            </template>
            <div class="jump-link">
                <el-link type="primary" @click="handleChange">{{ formType ? '返回登录' : '注册' }}</el-link>
            </div>
            <el-form 
            ref="loginFormRef"
            :model="loginForm" 
            :rules="rules">
                <el-form-item prop="userName">
                    <el-input v-model="loginForm.userName" placeholder="手机号" prefix-icon="UserFilled" />
                </el-form-item>
                <el-form-item prop="passWord">
                    <el-input v-model="loginForm.passWord" type="password" placeholder="密码" prefix-icon="Lock" />
                </el-form-item>
                <el-form-item v-if="formType" prop="validCode">
                    <el-input v-model="loginForm.validCode" placeholder="验证码" prefix-icon="Lock">
                        <template #append>
                            <span @click="countdownChange">{{ countdown.validText }}</span>
                        </template>
                    </el-input>

                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 100%;" @click="submitForm(loginFormRef)">
                        {{ !formType ? '登录' : '注册账号' }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-row>
</template>

<script setup >
import { ref, reactive, computed,toRaw } from 'vue'
import { ElLink, ElMessage } from 'element-plus';
import 'element-plus/es/components/link/style/css';  
import 'element-plus/es/components/message/style/css'
import { getCode, userAuthentication, login, menuPermissions } from '../../api'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const loginFormRef = ref()
//0登录，1注册
const formType = ref(0)

const routerList = computed(() => store.state.menu.routerList)
const loginForm = reactive(
    {
        userName: '',
        passWord: '',
        validCode:''

    }
)
const volidateUser = (rule, value, callback) => {
    //不能为空
    if(value === ''){
        callback(new Error('请输入账号'))
    }else{
        const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
        phoneReg.test(value) ? callback() : callback(new Error('手机号格式不对，请输入正确手机号'))
    }
}
const volidatePass = (rule, value, callback) => {
    //不能为空
    if(value === ''){
        callback(new Error('请输入密码'))
    }else{
        const passReg = /^[a-zA-Z0-9_-]{4,16}$/
        passReg.test(value) ? callback() : callback(new Error('密码格式不对，请输入4-16位字符'))
    }
}
//校验表单
const rules = reactive({
    userName:[{validator: volidateUser, trigger: 'blur'}],
    passWord:[{validator: volidatePass, trigger: 'blur'}]

})
//发送短信
const countdown = reactive({
    validText:'获取验证码',
    time: 60
})

let flag = false
let timer = ref(null);
//倒计时
const countdownChange = () => {
    if(flag) return
    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    if(!loginForm.userName || !phoneReg.test(loginForm.userName)){
        return ElMessage({
            message: '请检查手机号是否正确',
            type: 'warning'
  })
    }

    timer = setInterval(() => {
        if(countdown.time <= 0){
            countdown.time = 60
            countdown.validText = `获取验证码`
            flag = false
            clearInterval(timer)
            timer = null

        } else{
            countdown.time -= 1
            countdown.validText = `剩余${countdown.time}s`
            //console.log('倒计时初始状态：', countdown); 
        }
    }, 1000)
    flag = true
    getCode({tel: loginForm.userName}).then((data) => {
       // console.log(data)
       // console.log(data.code)
        if(data.code === 10000){
            ElMessage.success('发送成功')
            
        }
    })
}


const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href

const handleChange = () => {
    formType.value = formType.value ? 0 : 1
}

//提交表单
const submitForm = async(formEl) => {
    if (!formEl) return
    await formEl.validate((valid) => {
    if (valid) {
      if(formType.value){
        userAuthentication(loginForm).then(( data) => {
            console.log(data)
            if(data.code === 10000){
                ElMessage.success('注册成功，请登录')
                formType.value = 0
            }
        })
      } else{

        login(loginForm).then((data) => {
            console.log(data)
            if(data.code === 10000){
                ElMessage.success('登录成功')
                localStorage.setItem('pz_token', data.data.token)
                localStorage.setItem('pz_userInfo', JSON.stringify(data.data.userInfo))
                //router.push('/')
                menuPermissions().then(({data}) => {
                    console.log(data)
                    store.commit('dynamicMenu', data)
                   // console.log(routerList)
                   toRaw(routerList.value).forEach(element => {
                    router.addRoute('main', element)
                   })
                   router.push('/')
                })

            }
        })
      }
    } else {
      console.log('error submit!')
    }
  })
}
</script>

<style lang="less" scoped>
/* 局部 scoped 样式中修改：兼容语法 + 提高优先级 */
:deep(.el-card__header) {
  padding: 0;
}
.login-container {
    height: 100%;
    .card-header{
        background-color: #899fe1;
        img {
        width: 430px;
        }
    }
    .jump-link {
        text-align: right;
        margin-bottom: 10px;
    }
}

</style>