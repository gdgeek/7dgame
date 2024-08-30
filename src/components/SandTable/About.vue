<template>
  <!-- 关于我们板块 -->
  <section class="sandtable-section section-bgc-color">
    <div align="center">
      <h1 class="p-title-m">关于我们</h1>
      <h4>国内制作HoloLens数字沙盘起步早，项目经验丰富的高新科技企业。</h4>
      <p class="section-underline-style" />
    </div>

    <div align="center" style="margin: 30px 3% 10px">
      <div class="about-content section-radius">
        <h5>
          上海游七网络科技有限公司，国内制作HoloLens
          数字沙盘起步早，项目经验丰富的高新科技企业。
          在多年的积累下，我司数字沙盘项目技术成熟，操作流程熟练，质量高度保证
          。可以做到质量高、低成本、效果好、开发速度快，客户满意度高。
        </h5>
        <h5>
          在过去四年里，我司积累超过100个HoloLens项目开发的经验和数十个数字沙盘经验，为国内多家知名企事业单位制作会展和展馆用的数字沙盘，其中包括：
          一汽解放智能汽车沙盘/上海徐汇区云赛空间/安顺数字展馆项目/成都精诚以
          诺上市发布会数字沙盘/上海桃浦活动中心数字沙盘/中国2017年电信展中国
          电信物联网沙盘/丽水移动服务大厅沙盘项目/海口农业银行数字沙盘（以上案
          例视频均可请向我司索取）。
        </h5>
      </div>
      <div align="center">
        <img
          src="/media/bg/test2.jpg"
          style="width: 100%"
          class="section-radius"
        />
      </div>
    </div>

    <br />
  </section>
</template>

<script>
import '@/assets/font/font.css'
export default {
  name: 'About',

  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/responsive-style.scss';
@import '~@/styles/sandtable.scss';
.about-content {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #5095ea;
  color: #fff;
}
</style>
