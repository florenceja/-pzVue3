import request from '../utils/request'

//发送验证码
export const getCode = (data) => {
    return request.post('/get/code', data)
}

//注册用户
export const userAuthentication = (data) => {
    return request.post('/user/authentication', data)
}

//用户登录
export const login = (data) => {
    return request.post('/login', data)
}

//权限管理列表
export const authAdmin = (params) => {
    return request.get('/auth/admin', {params})
}

//菜单权限数据
export const userGetmenu = (params) => {
    return request.get('/user/getmenu', {params})
}

//权限修改
export const userSetmenu = (data) => {
    return request.post('/user/setmenu', data)
}

//权限菜单列表
export const menuList = (params) => {
    return request.get('/menu/list', {params})
}

//菜单权限下拉
export const menuSelectList = () => {
    return request.get('/menu/selectlist')
}

//用户信息修改
export const updateUser = (data) => {
    return request.post('/update/user', data)
}

///menu/permissions用户菜单权限
export const menuPermissions = () => {
    return request.get('/menu/permissions')
}

///photo/list陪护师头像
export const  photoList = () => {
    return request.get('/photo/list')
}

//companion陪护师创建
export const companion = (data) => {
    return request.post('/companion', data)
}

//companion/list陪护师列表
export const companionList = (params) => {
    return request.get('/companion/list', {params})
}

//delete/companion陪护师删除
export const deleteCompanion = (data) => {
    return request.post('/delete/companion', data)
}

//订单列表
export const adminOrder = (params) => {
    return request.get('/admin/order', {params})
}

//update/order服务状态完成
export const updateOrder = (data) => {
    return request.post('/update/order', data)
}

///report首页报表信息
export const report = (params) => {
    return request.get('/report', {params})
}