<template>
  <!-- 列表 -->
  <div class="background-box">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <div class="background-img">
          <div class="portal-background-url1 p-positon-auto" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <div class="background-text" align="left">
          <h1 class="p-title-m">生态与支持</h1>
          <p style="font-size: 18px; font-weight: lighter; line-height: 26px">
            MrPP.com
            是一款面向未来元宇宙数字生态的AR元宇宙实景平台。拥有第三方视角、空间场景定位等多项专利。给用户提供强大的编辑能力，一站式实现用户所需的可视化处理。
            在元宇宙实景交互这个过程中，它注重于人的感受场景的体验，带给人们多维度的视觉震撼感，让展馆极具吸引力与生命力，大大提升品牌的价值。
          </p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import '@/assets/font/font.css'
import 'element-ui/lib/theme-chalk/display.css'
export default {
  name: 'ExhibitionList',

  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/publicity-position.scss';
@import '~@/styles/responsive-style.scss';
.background-box {
  padding: 5% 0 60px;
  background-color: #222222;
}

.background-text {
  padding: 14% 12% 0 12%;
  color: #fff;
  max-width: 660px;
}

.background-img {
  position: relative;
  width: 100%;
  height: 60vw;
  max-height: 500px;
}
.portal-background-url1 {
  width: 80%;
  height: 80%;
  border-radius: 5px;
  background: url('/media/bg/m-list4.jpg') center no-repeat;
  background-size: cover;
}
</style>
