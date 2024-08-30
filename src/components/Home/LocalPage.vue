<template>
  <div>
    <div>
      <aside style="margin-top: 15px" />
      你好，可以启动iPad 连接工具扫码连接此系统。
      <br />
      <br />
      <el-card>
        <div slot="header">
          <b id="title">
            <font-awesome-icon icon="qrcode" />
            程序扫码，连接服务器 [{{ ip }}]
          </b>
        </div>
        <qrcode-vue :value="value" :size="size" level="H" />
      </el-card>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import env from '@/environment.js'
import { mapState } from 'vuex'
export default {
  name: 'LocalPage',
  components: {
    QrcodeVue
  },
  data() {
    const qrcode = {
      veri: 'MrPP.com',
      api: env.api
    }
    return {
      value: JSON.stringify(qrcode),
      size: 400
    }
  },

  computed: {
    ...mapState({
      document: state => state.document.index
    }),
    ip() {
      return environment.ip
    }
  },
  mounted() {
    const self = this

    self.onresize()
    window.addEventListener('resize', self.onresize, false)
  },
  destroyed() {
    window.removeEventListener('resize', self.onresize)
  },
  methods: {
    onresize() {
      this.size = Math.min(500, window.innerWidth * 0.8 - 100)
    }
  }
}
</script>
