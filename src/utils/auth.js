import Cookies from 'js-cookie'

const TokenKey = 'wuyuwei-token' // 设置唯一的key

const TimeKey = 'hrass-timestamp-key'// 时间戳
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 获取事件戳
export function getTimeStamp() {
  return Cookies.get(TokenKey)
}
 // 读取时间戳
export function setTimeStamp() {
  Cookies.set(TimeKey, Date.now())
}
