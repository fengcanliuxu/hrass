<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <!-- 左侧内容 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 右侧内容 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <!-- 内容 -->
            <span>
              操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">
                编辑部门
              </el-dropdown-item>

              <el-dropdown-item v-if="!isRoot" command="del">
                删除部门
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments.js'
export default {
  name: 'TreeTools',
  props: {
    // 定义传入的属性
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  // 点击下拉菜单行为
  methods: {
    operateDepts(type) {
      if (type === 'add') {
        // 添加 在当前点击部门下进行添加
        this.$emit('addDepts', this.treeNode) // 触发事件显示弹层
      } else if (type === 'edit') {
        // 编辑
        this.$emit('editDepts', this.treeNode) // 点击谁编辑谁
      } else {
        this.$confirm('您确定要删除该组织部门吗?')
          .then(() => {
            return delDepartments(this.treeNode.id)
          })
          .then(() => {
            // 只需要等到成功的时候 调用接口删除了 后端数据变化了 但是前端没变 重新获取数据
            this.$emit('delDepts') // 触发自定义事件
            this.$message.success('删除成功')
          })
      }
    }
  }
}
</script>

<style>
</style>
