import axios from 'axios'
import { Message } from 'element-ui'
const service = axios.create({
// 当执行npm run serve时会触发/api从而可以跨域
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 设置超时事件
})
// 请求拦截器
service.interceptors.request.use()
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
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误，让执行链跳出成功，直接进入catch
 })
export default service
