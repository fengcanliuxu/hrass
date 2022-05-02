<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 -->
      <el-card class="tree-card">
        <!-- 结构内容 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- el-tree -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容插槽 插槽内容会循环多次,有多少节点就循环多少次-->
          <!-- 作用域插槽 slot-scope="obj" 接受传递给插槽的数据  data每一个节点的数据对象-->
          <tree-tools
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹层组件 -->
    <AddDep
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDepartments"
    />
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
import TreeTools from './components/tree-tools.vue'
import { tranListToTreeDate } from '@/utils'
import AddDep from './components/add-dep.vue'
export default {
  components: { TreeTools, AddDep },
  data() {
    return {
      showDialog: false,
      node: null, // 记录当前点击节点  可以是添加也可能是编辑
      company: { name: '无欲为的项目', manager: '风残柳絮' }, // 头部数据结构
      defaultProps: {
        label: 'name'
      },
      departs: []
      // defaultProps: {
      //   label: 'name' // 这个属性显示内容
      // children: 'children' // 这个属性去找子节点
      // }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: '无欲为的项目', manager: '风残柳絮', id: '' }
      this.departs = tranListToTreeDate(result.depts, '') // 需要准换为树形结构
    },
    // 添加
    addDepts(node) {
      this.showDialog = true // 显示弹层
      this.node = node
    },
    // 编辑
    editDepts(node) {
      this.showDialog = true // 弹出层
      this.node = node
      // 调用获取部门详情方法
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
