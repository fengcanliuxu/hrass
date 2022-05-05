<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- <h2>权限管理</h2> -->
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button slot="after" type="primary" @click="addPermission(1, '0')">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <!-- 指定id为唯一属性 -->
      <el-table border :data="list" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" align="center" prop="code" />
        <el-table-column label="描述" align="center" prop="description" />
        <el-table-column label="操作" align="center">
          <template v-slot="{ row }">
            <!-- 添加按钮旨在访问权层级显示 当type===1时显示 -->
            <el-button v-if="row.type === 1" type="text" @click="addPermission(2, 'row.id')">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增和编辑弹层 -->
    <el-dialog :visible="showDialog" :title="showText" @close="btnCancel">
      <el-form ref="permForm" label-width="120px" :model="formData" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch v-model="formData.enVisible" style="width:90%" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import { getPermissionList, delPermission, addPermission, updatePermission, getPermissionDetail } from '@/api/permisson'
import { tranListToTreeDate } from '@/utils'
export default {
  data() {
    return {
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },

      list: [],
      showDialog: false
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增权限'
    }
  },
  created() { this.getPermissionList() },
  methods: {
    async getPermissionList() {
      // 将数据转化成带children数据
      this.list = tranListToTreeDate(await getPermissionList(), '0')
    },
    delPermission(id) {
      this.$confirm('确认删除该权限马').then(() => {
        return delPermission(id)
      }).then(() => {
        this.$message.success('删除成功')
        this.getPermissionList()
      })
    },
    // type标识类型 pid标识当前父节点标识
    addPermission(type, pid) {
      // 记录当前类型和标识
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    btnOK() {
      this.$refs.permForm.validate().then(() => {
        // 校验成功
        if (this.formData.id) {
          return updatePermission(this.formData)
        }
        return addPermission(this.formData)
      }).then(() => {
        this.$message.success('操作成功')
        this.getPermissionList()
        this.showDialog = false
      })
    },
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.permForm.resetFields()
      this.showDialog = false
    },
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }
  }
}
</script>

<style>
</style>
