<template>
  <!-- 展馆 -->
  <section>
    <el-row :gutter="40" style="padding: 5% 10%">
      <!-- content部分 -->
      <el-col :span="24">
        <div align="left" style="padding: 30px 0">
          <h1 class="content-color p-title-m">开始部署一个场景</h1>
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" align="left">
        <section class="icon-box content-color">
          <img src="/media/icon/ex-icon1.png" />
          <h3 class="p-title-s">对展馆场景空间扫描</h3>
          <h4>我们有多种设备和扫描方案，根据客户的需要选择。</h4>
        </section>
      </el-col>
      <!-- 视频位置 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" align="left">
        <section class="icon-box content-color">
          <img src="/media/icon/ex-icon2.png" />
          <h3 class="p-title-s">在平台进行相关编辑</h3>
          <h4>自主研发的可视化编辑平台，一站式录入和编辑</h4>
        </section>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" align="left">
        <section class="icon-box content-color">
          <img src="/media/icon/ex-icon3.png" />
          <h3 class="p-title-s">使用设备查看效果</h3>
          <h4>拥有多设备协同专利，可使用眼镜、手机和Pad进行查看</h4>
        </section>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import '@/assets/font/font.css'
export default {
  name: 'ExhibitionBody',
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/responsive-style.scss';
@import '~@/styles/publicity-position.scss';

.icon-box {
  margin-bottom: 40px;
  width: 80%;
}
</style>
