<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="80%"
    :close-on-click-modal="false"
  >
    <el-card class="box-card" style="text-align: center">
      {{ encode(verseId) }}

      <qrcode-vue :value="encode(verseId)" :size="size" level="H" />
    </el-card>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import environment from '@/environment.js'
import 'element-ui/lib/theme-chalk/display.css'

import { getVerse } from '@/api/v1/verse'
import QrcodeVue from 'qrcode.vue'
export default {
  name: 'MrPPQRCodeVerse',
  components: {
    QrcodeVue
  },
  data() {
    return {
      dialogVisible: false,
      value: 'https://mrpp.com',
      size: 400,
      verse: null
    }
  },
  'document.body.clientwidth': {
    message: function () {}
  },
  computed: {
    verseId() {
      if (this.verse) {
        return this.verse.id
      }
      return -1
    },
    dialogTitle() {
      if (this.verse) {
        return '请用设备扫描二维码，进入【' + this.verse.name + '】。'
      }
      return '请用设备扫描二维码，进入场景。'
    }
  },
  mounted() {
    const self = this
    self.$nextTick(function () {
      this.$on('open', self.open)
    })
    self.onresize()
    window.addEventListener('resize', self.onresize, false)
  },
  destroyed() {
    window.removeEventListener('resize', self.onresize)
  },
  methods: {
    encode(number) {
      if (number != -1) {
        return this.reverseBits(number)
          .toString()
          .padStart(6, '0')
          .split('')
          .reverse()
          .join('')
      }
      return ''
    },
    reverseBits(n) {
      let result = 0
      for (let i = 0; i < 18; i++) {
        // 将result左移一位，为即将到来的位腾出空间
        result <<= 1
        // 获取n的最低位，加到result上
        result |= n & 1
        // 将n右移一位，准备处理下一位
        n >>= 1
      }
      // 因为JavaScript中的位运算是针对32位有符号整数的，所以最后返回时要使用>>>0将结果转换为无符号整数
      return result
    },
    onresize() {
      this.size = Math.min(500, window.innerWidth * 0.8 - 80)
    },
    async open(id) {
      const data = { projectId: id, veri: 'MrPP.com' }
      this.value = JSON.stringify(data)
      this.dialogVisible = true
      const r = await getVerse(id)
      this.verse = r.data
    }
  }
}
</script>
