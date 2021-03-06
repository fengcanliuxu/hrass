// 员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/employees', // 路由地址,
  name: 'employees', // 一级路由设置一个name属性，后期能用
  component: Layout,
  children: [
    {
      // path什么都不写表示二级路由的默认路由
      path: '', // 这里不用写 什么都不写表示/employees不但有布局layout=》员工主页
      component: () => import('@/views/employees'), // 路由懒加载
      // 路由的元信息，存储数据的位置
      meta: {
        title: '员工管理', // title，左侧导航读取这里的title属性
        icon: 'people'
      }
    }, {
      path: 'detail/:id?', // 动态路由传参  /employees/datail
      component: () => import('@/views/employees/detail'),
      hidden: 'true', // 表示该内容不在左侧显示
      meta: {
        title: '员工详情'
      }
    }]
}
