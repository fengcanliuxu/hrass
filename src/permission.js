// 权限拦截在路由跳转 导航守卫

import router from '@/router' // 不需要导出在main中已经引入
import store from '@/store' // 引入store实例=this.$store
// import nprogress from 'nprogress' // 引入进度条
// import 'nprogress/nprogress.css' // 引入进度条样式
// 前置守卫 next是必须的，如果不执行页面宣布死亡
// next（）直接跳转
// next（false）跳转终止
// next（地址） 跳到某个地址
const whiteList = ['/login', '/404'] // 定义白名单
router.beforeEach(async(to, from, next) => {
  // nprogress.start()// 开启进度条
  // 如果有token
  if (store.state.user.token) {
    // 直接跳转主页
    if (to.path === '/login') {
      next('/')
    } else {
      // 获取用户资料
      // 如果当前vuex中用用户资料的id表示已经有资料则不需要获取了
      if (!store.getters.userId) {
        // 没有id表示还未获取
      await store.dispatch('user/getUserInfo')
        // 如果后续需要根据同互资料获取数据的化，必需变为同步
      }
      next()
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
})
// 后置守卫
router.afterEach(() => {
//   nprogress.done()
})
