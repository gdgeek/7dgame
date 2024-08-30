<template>
  <div :style="_style">
    <el-button
      class="font-text"
      style="float: right; padding: 10px"
      @click="$router.push({ path: '/site/index' })"
    >
      平台注册/登陆
    </el-button>
  </div>
</template>

<script>
import '@/assets/font/font.css'
export default {
  props: {
    _style: {
      type: String,
      required: true
    }
  }
}
</script>
