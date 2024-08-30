<template>
  <div class="background-screen-border">
    <!-- 医疗巨幕板块 -->
    <screen :bg-url="bgUrl" :item="screen" />
    <!-- 视频应用白底色 -->
    <medical-video />
    <!-- 产品列表灰底色 -->
    <publick-list :items="list" />
    <!-- 系统子幕图绿底色-->
    <medical-column />
    <!-- 联系我们板块白底色 -->
    <relation />
    <!-- 合作伙伴板块新通用组件 -->
    <partner />
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
import Screen from '@/components/WebPublick/Screen.vue'
import MedicalVideo from '@/components/Medical/MedicalVideo.vue'
import PublickList from '@/components/WebPublick/PublickList.vue'
import MedicalColumn from '@/components/Medical/MedicalColumn.vue'
import Relation from '@/components/WebPublick/Relation.vue'
import Partner from '@/components/WebPublick/Partner.vue'
export default {
  name: 'Medical',
  components: {
    Screen,
    MedicalVideo,
    PublickList,
    MedicalColumn,
    Relation,
    Partner
  },
  data() {
    return {
      bgUrl: '/media/bg/m2-screen.jpg',
      screen: {
        title: '欢迎体验',
        title2: '元宇宙实景医疗',
        color: '#1d1d1f',
        tel: '15000159790',
        align: 'left'
      },
      list: [
        {
          title: '快速分析了解您的需求!',
          text: '资深专业人员将对您的需求进行详细了解，发送我们的案例给您参考，为您的绝妙创意提供最适合的解决方案，并全程为项目的实现提供咨询。',
          image: '/media/bg/m-list.jpg'
        },
        {
          title: '实景医疗AR产品部署',
          text: '我们将为您选择的产品方案进行展示和报价。满足客户的个性化需求。 并就实景体验进行沟通和交流，我们将提供后续一系列合作、培训及部署。',
          image: '/media/bg/m-list2.jpg'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/responsive-style.scss';
</style>
