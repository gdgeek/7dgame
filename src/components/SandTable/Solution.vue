<template>
  <div>
    <!-- 震撼沙盘板块 -->
    <section class="sandtable-section section-bgc-color">
      <br />
      <div align="center">
        <h1 class="p-title-m">虚实结合，震撼数字沙盘解决方案</h1>
        <h4>
          我们致力于扎根行业、深入场景进行产品设计和创新，为用户构建端到端的沙盘解决方案
        </h4>
        <p class="section-underline-style" />
      </div>
      <el-row :gutter="30" class="section-card-padding">
        <el-col
          v-for="(item, index) in items.slice(0, videoSlice)"
          :key="index"
          align="center"
          :xs="24"
          :sm="12"
          :md="12"
          :lg="24 / videoSlice"
          :xl="24 / videoSlice"
        >
          <basic-video :item="item" :video-padding="videoPadding" />
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
import '@/assets/font/font.css'
import BasicVideo from '@/components/WebPublick/BasicVideo.vue'
import { data } from '@/views/web/data/sandshow.js'
export default {
  name: 'Solution',
  components: {
    BasicVideo
  },
  data() {
    return {
      // 视频展示数量
      videoSlice: 3,
      // 视频,边框厚度px，默认则无边框
      videoPadding: '20'
    }
  },
  computed: {
    items() {
      return data
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/responsive-style.scss';
@import '~@/styles/sandtable.scss';
.section-card-padding {
  padding: 4%;
}
</style>
