<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置一个el-card -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户信息" style="margin-left: 120px; margin-top:30px">
            <!-- 内容 -->
            <el-form ref="userForm" label-width="120px" :rules="rules" :model="userInfo">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码" prop="password2">
                <el-input v-model="userInfo.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 内容 -->
            <!-- <UserInfo /> -->
            <component :is="UserComponent">
              <!-- //可以是任何组件  动态组件 可以切换组件 -->
            </component>
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 内容 -->
            <component :is="JobComponent" />
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

 <script>
import { getUsreDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/emplyees'
import UserInfo from './components/user-info'
import JobInfo from './components/job-info'

export default {
  components: {
    UserInfo, JobInfo
  },
  data() {
    return {
      UserComponent: 'UserInfo',
      JobComponent: JobInfo,
      userId: this.$route.params.id,
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.getUsreDetailById()
  },
  methods: {
    async getUsreDetailById() {
      this.userInfo = await getUsreDetailById(this.userId)
    },
    saveUser() {
      this.$refs.userForm.validate().then(async () => {
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password })
        this.$message.success('修改用户成功')
      })
    }
  }
}
</script>

 <style>
</style>
