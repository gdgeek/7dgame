<template>
  <!-- 应用场景组件 -->
  <section class="section-box">
    <el-row :gutter="30" class="p-pc-pfr">
      <!-- content部分 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" align="left">
        <div class="title-box content-color">
          <h1 class="public-title-margin p-title-m medical-color">
            医疗核心应用场景
          </h1>
          <h4>
            <!-- 具有数字沙盘、实现AR实景展示、网站增强现实3D效果呈现、AR产品互动营销等AR营销方式 -->
            私有部署方案，可实现AR实景展示、多设备数字可视化协同
          </h4>
          <h5 style="line-height: 1.4; letter-spacing: 1px">
            元宇宙实景编程平台（MrPP.com），
            是一个让任何人都可以轻松创建AR场景的创作平台，支持可视化编程，三方视角（观众视角），空间场景定位等有趣的功能。给用户提供强大的编辑能力，让用户可以随时随地创造有趣的AR协同场景。
            <br />
            <br />
            在传统医疗场景，我们提供平台的私有部署方案，医生可以上传CT模型，在MR/AR设备中展示和查看。可广泛用于医疗可视化教学、手术培训、机理模型多层分析，帮助医护工作者和患者借助元宇宙的手段更好的展开工作。
          </h5>
        </div>
      </el-col>
      <!-- 视频位置 -->
      <!-- 跳转B站播放视频，带封面 -->
      <el-col align="center" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <a
          href="https://www.bilibili.com/video/BV1DR4y1s7nV/?spm_id_from=333.999.0.0"
          target="_blank"
        >
          <div class="medical-video-box">
            <img
              src="/media/bg/medical-play.jpg"
              style="width: 100%; border-radius: 5px"
            />
          </div>
        </a>
      </el-col>
    </el-row>
    <br />
    <br />
  </section>
</template>

<script>
import '@/assets/font/font.css'
export default {
  name: 'MedicalVideo',
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/responsive-style.scss';
@import '~@/styles/publicity-position.scss';
.section-box {
  padding: 8% 20px 6%;
}
.title-box {
  margin: 2% 4%;
  max-width: 570px;
}
.video-box {
  background-color: rgb(190, 232, 235);
  height: 400px;
}
.medical-video-box {
  padding-top: 2%;
  width: 90%;
}
</style>
