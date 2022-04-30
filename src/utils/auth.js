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

export function getTimeStamp() {
  Cookies.get(TimeKey)
}
export function setTimeStamp() {
  Cookies.set(TimeKey, Date.now())
}
