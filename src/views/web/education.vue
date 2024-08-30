<template>
  <div class="background-screen-border">
    <!-- 巨幕板块 -->
    <demo-screen-show />

    <screen :bg-url="bgUrl" :item="screen" />

    <!-- 应用场景 -->
    <education-solution />

    <!-- 产品中心 -->
    <education-cloud />

    <!-- 创新协同体验 -->
    <education-deploy />

    <!-- 系统子幕图-->
    <education-subscreen />

    <!-- 联系我们 -->
    <relation />
    <!-- 合作伙伴板块新通用组件 -->
    <partner />
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
import DemoScreenShow from '@/components/MrPP/MrPPDemo/DemoScreenShow.vue'
import Screen from '@/components/WebPublick/Screen.vue'
import EducationCloud from '@/components/Education/EducationCloud.vue'
import EducationSolution from '@/components/Education/EducationSolution.vue'
import EducationDeploy from '@/components/Education/EducationDeploy.vue'
import EducationSubscreen from '@/components/Education/EducationSubscreen.vue'
import Relation from '@/components/WebPublick/Relation.vue'
import Partner from '@/components/WebPublick/Partner.vue'
export default {
  name: 'Education',
  components: {
    DemoScreenShow,
    Screen,
    EducationCloud,
    EducationSolution,
    EducationDeploy,
    EducationSubscreen,
    Relation,
    Partner
  },
  data() {
    return {
      bgUrl: '/media/bg/education.jpg',
      screen: {
        title: '为您私有部署',
        title2: '元宇宙数字化教育方案',
        color: '#1d1d1f',
        tel: '15000159790',
        align: 'left'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/sandtable.scss';
@import '~@/styles/responsive-style.scss';
</style>
