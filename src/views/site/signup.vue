<template>
  <mr-p-p-site>
    <h2 class="signup-title">注册用户</h2>
    <div class="signup-head">
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        class="signup-form"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" suffix-icon="el-icon-user" />
        </el-form-item>
        <el-form-item label="电子邮件" prop="email">
          <el-input v-model="form.email" suffix-icon="el-icon-message" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            autocomplete="off"
            suffix-icon="el-icon-lock"
            type="password"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input
            v-model="form.checkPassword"
            type="password"
            autocomplete="off"
            suffix-icon="el-icon-view"
          />
        </el-form-item>
        <el-form-item label="邀请码" prop="invitation">
          <el-input
            v-model="form.invitation"
            suffix-icon="el-icon-connection"
          />
        </el-form-item>
        <el-form-item>
          <el-button-group class="signup-button">
            <el-button
              style="width: 110px"
              type="primary"
              @click="submit('form')"
            >
              注册
            </el-button>
            <el-button style="width: 110px" @click="resetForm('form')">
              重置
            </el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <div class="signup-link">
        <router-link to="/site/resend-verification-email">
          <el-link type="primary" :underline="false">重新发送验证邮件</el-link>
        </router-link>
        <br />
      </div>
      <div class="signup-link">
        <router-link to="/site/login">
          <el-link type="primary" :underline="false">登录账号</el-link>
        </router-link>
        <br />
        <router-link to="/site/request-password-reset">
          <el-link type="primary" :underline="false">找回密码</el-link>
        </router-link>
        <br />
      </div>
    </div>
    <hr />
    <div class="signup-body">
      <div class="signup-hint">微信扫码，得到测试资格</div>
      <img
        src="@/assets/image/qrcode.jpg"
        class="signup-qrcode"
        width="100%"
        alt="qrcode"
      />
    </div>
  </mr-p-p-site>
</template>

<script>
// @ is an alias to /src
import MrPPSite from '@/components/MrPP/MrPPSite'
import { mapMutations } from 'vuex'
import { signup } from '@/api/sites'
export default {
  name: 'Signup',

  components: {
    MrPPSite
  },
  data() {
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
        email: null,
        password: null,
        checkPassword: null,
        invitation: null
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 5, message: '用户名称长度应该大于5', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
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
        ],
        invitation: [
          { required: true, message: '请输入邀请码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['flashSetup']),
    open() {
      this.isShow = !this.isShow
    },
    submit(formName) {
      const self = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          signup(self.form)
            .then(data => {
              self.flashSetup({
                title: '注册成功',
                description: '感谢您的注册。请检查您的收件箱中的验证邮件。'
              })
              self.$router.push({ path: '/site' })
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
    },
    error(msg) {
      this.title = ''
      if (typeof msg === 'string') {
        this.title = msg
      } else {
        let i = 0
        for (const item in msg) {
          ++i
          this.title += i + '.' + item + ' : ' + msg[item] + '\n'
        }
      }
      this.isShow = true
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

.signup-title {
  color: #444444;
  margin: 20px 0 20px;
  text-align: center;
  font-weight: bold;
}
.signup-head {
  padding: 0 10px 10px 10px;
  max-width: 100%;
}
.signup-form {
  margin-top: 20px;
  height: 100%;
  max-width: 100%;
  padding: 10px 20px 0px 10px;
}
.signup-link {
  padding: 10px 10px 10px 10px;
}
.signup-link a {
  color: rgb(28, 160, 212);
  font-size: 16px;
}

.signup-body {
  padding-top: 14px;
  height: 100%;
  max-width: 100%;
  padding: 10px 10px 20px 10px;
}

.signup-hint {
  font-size: 14px;
  font-weight: lighter;
  color: #666;
  font-weight: bold;
}

.signup-qrcode {
  margin-top: 2px;
  border: 1px solid;
  border-radius: 4px;
  border-color: rgb(213, 216, 216);
}
</style>
