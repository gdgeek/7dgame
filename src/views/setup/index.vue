<template>
  <mr-p-p-site>
    <div class="module-head">
      <h1 class="module-welcome">新世界的起点</h1>
      <p class="module-text">设置开始的信息</p>

      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane v-if="activeName == 'user'" name="user" label="初始化平台">
          <h2 class="login-title">创建管理员账号</h2>

          <el-form
            ref="form"
            :rules="rules"
            :model="form"
            class="signup-form"
            label-width="80px"
          >
            <el-form-item
              label="用户名"
              prop="username"
              style="margin-bottom: 26px"
            >
              <el-input v-model="form.username" suffix-icon="el-icon-user" />
            </el-form-item>
            <el-form-item
              label="密码"
              prop="password"
              style="margin-bottom: 26px"
            >
              <el-input
                v-model="form.password"
                autocomplete="off"
                suffix-icon="el-icon-lock"
                type="password"
              />
            </el-form-item>
            <el-form-item
              label="确认密码"
              prop="checkPassword"
              style="margin-bottom: 26px"
            >
              <el-input
                v-model="form.checkPassword"
                type="password"
                autocomplete="off"
                suffix-icon="el-icon-view"
              />
            </el-form-item>

            <el-form-item>
              <el-button-group class="signup-button">
                <el-button
                  style="width: 120px"
                  type="primary"
                  @click="submit('form')"
                >
                  提交
                </el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </mr-p-p-site>
</template>

<script>
import env from '@/environment.js'

import { init } from '@/api/v1/local'
import { setToken } from '@/utils/auth'
// @ is an alias to /src
import MrPPSite from '@/components/MrPP/MrPPSite/setup'
export default {
  name: 'ModuleIndex',
  components: {
    MrPPSite
  },
  data() {
    const checkUsername = (rule, value, callback) => {
      this.form.username = value.replace(/[\u4E00-\u9FA5]/g, '')
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.checkPassword !== '') {
          this.$refs.form.validateField('checkPassword')
        }
        callback()
      }
    }
    const checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        username: null,
        password: null,
        checkPassword: null
      },
      local: env.canRegister(),
      step: 0,
      activeName: 'user',
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 5, message: '用户名称长度应该大于5', trigger: 'blur' },
          {
            validator: checkUsername,
            message: '用户名请避免使用中文',
            trigger: 'change'
          }
        ],

        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度应该大于6', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请输入校验密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    submit(formName) {
      const self = this
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const response = await init({
            username: self.form.username,
            password: self.form.password
          })
          setToken(response.data.access_token)
          self.$router.push('/')
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.module-head {
  padding: 10px 10px 10px 10px;
  max-width: 100%;
}

.module-title {
  font-size: 14px;
  padding: 10px 10px 10px 10px;
  text-align: center;
  color: #666;
}

.module-welcome {
  margin-top: 20px;
  font-size: 36px;
  font-weight: normal;
  color: #666;
}

.module-text {
  font-size: 21px;
  font-weight: lighter;
  color: #666;
}

.module-link {
  margin-top: 10px;
}
.module-link a {
  color: rgb(28, 160, 212);
  font-size: 16px;
  line-height: 22px;
}

.module-body {
  padding-top: 14px;
  height: 100%;
  max-width: 100%;
  padding: 10px 10px 20px 10px;
}

.module-hint {
  font-size: 14px;
  font-weight: lighter;
  color: #666;
  font-weight: bold;
}

.module-qrcode {
  margin-top: 2px;
  padding: 6px;
  border: 1px solid;
  border-radius: 4px;
  border-color: rgb(213, 216, 216);
}
</style>
