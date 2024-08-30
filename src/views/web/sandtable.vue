<template>
  <div class="background-screen-border">
    <!-- 巨幕板块 -->
    <screen :bg-url="bgUrl" :item="screen" />
    <!-- 震撼沙盘板块 -->
    <solution />
    <!-- 介绍板块 -->
    <introduce />
    <!-- 关于我们板块 -->
    <about />

    <!-- 开发流程板块 -->
    <flow />
    <!-- 联系我们板块 -->
    <relation />
    <!-- 合作伙伴板块新通用组件 -->
    <partner />
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
import Screen from '@/components/WebPublick/Screen.vue'
import Solution from '@/components/SandTable/Solution.vue'
import About from '@/components/SandTable/About.vue'
import Introduce from '@/components/SandTable/Introduce.vue'
import Flow from '@/components/SandTable/Flow.vue'
import Relation from '@/components/SandTable/Relation.vue'
import Partner from '@/components/WebPublick/Partner.vue'
export default {
  name: 'SandTable',
  components: {
    Screen,
    Solution,
    About,
    Introduce,
    Flow,
    Relation,
    Partner
  },
  data() {
    return {
      bgUrl: '/media/bg/sand-screen.jpg',
      screen: {
        title: '',
        title2: '全息数字沙盘制作 震撼来袭',
        color: '#f5f4f3',
        tel: '15000159790',
        align: 'center'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/sandtable.scss';
@import '~@/styles/responsive-style.scss';
</style>
