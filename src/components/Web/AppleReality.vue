<template>
  <div>
    <div class="portal-main-background">
      <div class="content" align="right">
        <span
          class="font-title"
          style="font-size: 40px; color: whitesmoke; word-wrap: break-word"
        >
          Apple Reality.com
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
          积极参与到苹果AR开发中
        </b>
        <br />

        <br />
        <el-button class="font-text" type="primary">
          <a
            target="_blank"
            href="https://www.bilibili.com/video/BV1Rg4y1u72s/"
            class="phone-boder"
          >
            给提姆库克先生的一封感谢信
          </a>
        </el-button>
        <br />
        <br />

        <el-button class="font-text">
          <a ref="telPhone" href="tel:15000159790" class="phone-boder">
            索取域名 (如果您是苹果官方)
          </a>
        </el-button>
      </div>
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
  background: url('/media/bg/apple.png') center no-repeat;
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
