import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import store from '@/store'
import { getTimeStamp } from './auth'
const TimeOut = 3600 // 定义超时时间
const service = axios.create({
// 当执行npm run serve时会触发/api从而可以跨域
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 设置超时事件
})
// 请求拦截器
service.interceptors.request.use(config => {
  // config请求的配置信息，必须要返回
  // 注入token
  if (store.getters.token) {
    // 只有在有token的情况下才有必要检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果为true表示过期了
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use((response) => {
  // axios默认加一个data
const { success, message, data } = response.data
// 根据success成功与否和下面进行操作
if (success) {
  return data
} else {
   // 业务已经错了，需要进catch
  Message.error(message) // 提示错误消息
  return Promise.reject(new Error(message))
}
}, error => {
  // error信息里面 response的对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002时表示后端传递token失效
    store.dispatch('user/logout')
    router.push('/login')
  } else {
 Message.error(error.message) // 提示错误信息
}

  return Promise.reject(error) // 返回执行错误，让执行链跳出成功，直接进入catch
 })
 // 检查是否超时
 function IsCheckTimeOut() {
  const currentTime = Date.now()
  const timeStamp = getTimeStamp()
 return (currentTime - timeStamp) / 1000 > TimeOut
 }
export default service
