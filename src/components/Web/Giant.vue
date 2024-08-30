<template>
  <div class="portal-main-background">
    <div class="content" align="right">
      <span
        class="font-title"
        style="font-size: 40px; color: whitesmoke; word-wrap: break-word"
      >
        元宇宙实景编程平台
      </span>
      <br />

      <br />

      <b
        class=""
        style="
          font-weight: lighter;
          font-size: 25px;
          color: whitesmoke;
          word-wrap: break-word;
        "
      >
        让每个人都可以快乐地创造世界
      </b>
      <br />

      <br />
      <el-button class="font-text" @click="goto('/site/index')" type="primary">
        登入平台
      </el-button>
      <el-button class="font-text" @click="goto('/site/download')">
        相关下载
      </el-button>
    </div>
  </div>
</template>

<script>
import '@/assets/font/font.css'
export default {
  name: 'Giant',

  data() {
    return {}
  },
  methods: {
    goto(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.portal-main-background {
  width: 100%;
  height: 300px;
  background: url('/media/bg/hololens.jpg') center no-repeat;
  background-size: cover;
  // background-size: 100%;
}

.content {
  padding-right: 50px;
  padding-top: 50px;
  padding-left: 50px;
  float: right;
}
</style>
