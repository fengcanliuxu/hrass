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

export function getInfo(token) {

}

export function logout() {

}
