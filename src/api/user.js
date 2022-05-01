import request from '@/utils/request'

// 登录接口
export function login(data) {
   return request({
    url: '/sys/login',
    method: 'POST',
    // data: data
    data // Es6
  })
}

// 获取用户资料
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 获取用户信息获取用户头像
export function getUsreDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {

}
