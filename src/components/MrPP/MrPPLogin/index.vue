<template>
  <div class="font-text">
    <h2>登录账号</h2>

    <el-form
      ref="form"
      class="login-body"
      :rules="rules"
      :model="form"
      label-width="75px"
    >
      <el-form-item label="用户名" prop="username" style="margin-bottom: 26px">
        <el-input v-model="form.username" suffix-icon="el-icon-user" />
      </el-form-item>
      <el-form-item label="密码" prop="password" style="margin-bottom: 26px">
        <el-input
          v-model="form.password"
          type="password"
          suffix-icon="el-icon-lock"
          @keyup.enter.native="submit('form')"
        />
      </el-form-item>

      <el-form-item class="login-button">
        <el-button style="width: 100%" type="primary" @click="submit('form')">
          登陆平台
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { UpdateAbility } from '@/ability/ability'

// @ is an alias to /src
import { setToken } from '@/utils/auth'
import { login } from '@/api/sites'
export default {
  name: 'MrPPLogin',
  data() {
    return {
      form: {
        username: null,
        password: null
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 5, message: '用户名称长度应该大于5', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度应该大于6', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit(formName) {
      const self = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          login({
            username: self.form.username,
            password: self.form.password
          })
            .then(response => {
              console.log(response)
              if (response.data) {
                setToken(response.data.access_token)
                this.$store.commit('user/setUser', response.data.user)
                UpdateAbility(self.$ability, response.data.user.roles)
                this.$router.push('/')
              }
            })
            .catch(e => {})
        } else {
          return false
        }
      })
    }
  }
}
</script>
