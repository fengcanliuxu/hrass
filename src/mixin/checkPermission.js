import store from '@/store'
// 做一个混入对象
export default {
  // 混入对象是组件的选项对啊行
  methods: {
    // 检查权限 key是要检查的点
    checkPermission(key) {
      // 去用户信息里面找
      // store.state.user.userInfo.roles.points
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => { item === key })
      }
      return false // 没有进入if说明没有权限
    }
  }
}
