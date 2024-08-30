<template>
  <div class="background-screen-border">
    <!-- 展馆主屏幕 -->
    <screen :bg-url="bgUrl" :item="screen" />
    <!-- 图片场景介绍 -->
    <exhibition-picture />
    <!-- 视频案例 -->
    <exhibition-video />
    <!-- 实施步骤 -->
    <exhibition-body />
    <!-- 技术服务 -->
    <exhibition-list />
    <!-- 联系我们 -->
    <relation :is-black="isBlack" />
    <!-- 合作伙伴板块新通用组件 -->
    <partner />
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
import Screen from '@/components/WebPublick/Screen.vue'
import ExhibitionPicture from '@/components/Exhibition/ExhibitionPicture.vue'
import ExhibitionVideo from '@/components/Exhibition/ExhibitionVideo.vue'
import ExhibitionBody from '@/components/Exhibition/ExhibitionBody.vue'
import Relation from '@/components/WebPublick/Relation.vue'
import ExhibitionList from '@/components/Exhibition/ExhibitionList.vue'
import Partner from '@/components/WebPublick/Partner.vue'

export default {
  name: 'Exhibition',
  components: {
    Screen,
    ExhibitionPicture,
    ExhibitionVideo,
    ExhibitionBody,
    Relation,
    ExhibitionList,
    Partner
  },
  data() {
    return {
      bgUrl: '/media/bg/ex-screen.jpg',
      screen: {
        title: '欢迎创建',
        title2: '元宇宙实景展馆',
        color: '#f5f4f3',
        tel: '15000159790',
        align: 'left'
      },
      isBlack: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/responsive-style.scss';
</style>
