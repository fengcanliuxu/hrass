<template>
  <!-- // 放置弹层组件 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancle">
    <!-- 表单数据 -->
    <el-form
      ref="deptForm"
      label-width="120px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- native是可以找到原生的修饰符 -->
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <!-- 遍历选项 -->
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>

    <!-- 确定和信息 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancle">取消</el-button>
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updataDepartments
} from '@/api/departments'
import { getEmployeeSimple } from '@/api/emplyees'
export default {
  name: 'AddDep',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门是否重复
    const checkNameRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点
      let isRepeat = false
      if (this.formData.id) {
        // 有id就是编辑模式 编辑数据在数据库中已经存在，同级部门下，我的名字不能和其他同级部门名字重复
        // 找到同级id
        isRepeat = depts
          .filter(
            (item) =>
              item.pid === this.treeNode.pid && item.id !== this.formData.id
          )
          .some((item) => item.name === value)
      } else {
        // 没有id就是新增模式
        isRepeat = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value)
      }
      isRepeat
        ? callback(new Error(`同级部门下已经有${value}的部门了`))
        : callback()
    }
    const checkCodeRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式下
        isRepeat = depts.some(
          (item) => item.id !== this.formData.id && item.code === value && value
        )
      } else {
        // 新增模式下
        isRepeat = depts.some((item) => item.code === value && value)
      }
      // 要求编码和所有的部门编码都不能重复，由于看i是数据有可能没有code 所以添加一个强制性条件 value不为空
      isRepeat
        ? callback(new Error(`组织架构下已经存在这个${value}编码了`))
        : callback()
    }
    return {
      // 校验数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: checkNameRepeat
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50个字符',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: checkCodeRepeat
          }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            trigger: 'blur',
            min: 1,
            max: 300,
            message: '部门介绍要求1-50个字符'
          }
        ]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 获取详情方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
      // 因为在父组件使用子组件方法 显示设置node数据直接调用方法--使用this。treeNode。id可能取不到
      // props传值是异步的
    },
    btnOk() {
      // 手动校验表单
      this.$refs.deptForm.validate(async (isOK) => {
        // 表单校验成功
        if (isOK) {
          if (this.formData.id) {
            // 编辑
            await updataDepartments(this.formData)
          } else {
            // 将id设置为pid
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 表单校验通过
          // 刷新数据
          this.$emit('addDepts') // 触发一个自定义事件
          this.$emit('update:showDialog', false)
          // 会触发el-dialog 所以这里不需要单独重置数据
        }
      })
    },
    btnCancle() {
      // 重置数据 resetFields只能重置表单上的数据
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 清除校验 可以重置数据但是只能重置在data中的护具
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>

<style>
</style>
