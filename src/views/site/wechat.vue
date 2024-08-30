<template>
  <mr-p-p-site>
    <el-card shadow="hover" :body-style="{ padding: '0px' }">
      <span slot="header" class="mrpp-title">
        {{ token }}
        <b class="card-title" nowrap>微信扫码进入</b>
      </span>
      <el-image
        :src="qrcode"
        style="width: 100%; height: 400px"
        fit="contain"
        lazy
      />
    </el-card>
  </mr-p-p-site>
</template>

<script>
import { qrcode, openid } from '@/api/wechats'
// @ is an alias to /src
import MrPPSite from '@/components/MrPP/MrPPSite'
export default {
  name: 'Wechat',
  components: {
    MrPPSite
  },

  data() {
    return {
      qrcode: '',
      token: '',
      interval: null
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  created() {
    const self = this
    qrcode().then(response => {
      console.log(response.data.qrcode)
      self.qrcode = response.data.qrcode
      self.token = response.data.token
    })
    self.interval = setInterval(() => {
      self.refresh()
    }, 1000)
  },
  methods: {
    refresh() {
      const self = this
      openid(this.token).then(response => {
        console.log(response.data)
        if (typeof response.data !== 'undefined') {
          console.log(self.token)
          console.log(response.data.token)
          if (
            typeof response.data.token !== 'undefined' &&
            response.data.token === self.token
          ) {
            if (typeof response.data.user !== 'undefined') {
              this.$router.push({
                path: '/site/wechat-login',
                query: { token: response.data.token }
              })
            } else {
              this.$router.push({
                path: '/site/wechat-signup',
                query: { token: response.data.token }
              })
            }
          }
        }
      })
    }
  }
}
</script>
