import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUsreDetailById } from '@/api/user'
// 状态
const state = {
  token: getToken(), // 设置token为共享状态 初始化vuex的时候 就从缓存中读取
  userInfo: {} // 设置为空会导致快捷访问--映射出现问题
}
// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token // 将数据设置给vuex
    // 同步缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken() // 缓存置空
  },
  // 设置用户信息
  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result // 这样是响应式
    // state.userInfo = { ...result } // 浅拷贝
  },
  // 移除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
 async login(context, data) {
    // 调用api接口
    const result = await login(data) // 拿到token
    context.commit('setToken', result) // 设置token
    // 拿到token说明登录成功
    setTimeStamp() // 设置当前时间戳
  },
  async getUserInfo(context) {
  const result = await getUserInfo()
  // 获取用户详情
  const baseInfo = getUsreDetailById(result.userId)
  context.commit('setUserInfo', { ...result, ...baseInfo }) // 提交mutations
  return result // 给后期权限管理做铺垫
  },
  // 登出操作 删除token 删除用户资料
 logout(context) {
   context.commit('removeToken')
   context.commit('removeUserInfo')
 }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
