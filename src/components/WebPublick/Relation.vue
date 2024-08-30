<template>
  <!-- 产品中心 -->
  <div class="section-box">
    <el-row :gutter="30">
      <el-col :span="22" :offset="2">
        <h4 class="reletion-title-small content-color">以用户为中心</h4>
        <div
          :class="[isBlack ? 'reletion-title-black' : 'reletion-title-blue']"
        >
          <div class="p-title-m font-text">欢迎联系我们</div>
        </div>
        <!-- <div class="reletion-title-h1 p-title-m">欢迎联系我们</div> -->
      </el-col>
      <el-col :xs="22" :sm="22" :md="10" :lg="10" :xl="10" :offset="2">
        <h2 class="p-title-s content-color">公司简介</h2>
        <div class="reletion-box font-text content-color">
          <div style="width: 90%" class="content-box">
            上海游七网络科技有限公司，作为国内制作元宇宙AR实景应用起步早的高新科技企业，
            团队项目开发经验丰富，技术方案灵活多样。与未来数字化生态相融合，不断进取。
          </div>
        </div>
      </el-col>
      <!-- 视频位置 -->
      <el-col :xs="22" :sm="22" :md="10" :lg="10" :xl="10" :offset="2">
        <h2 class="p-title-s content-color">联系方式</h2>
        <section class="reletion-box font-text content-color">
          <div class="content-box countent-style">
            <img src="/media/icon/relation-icon1.png" class="icon-style" />
            <span>上海市徐汇区虹漕路25-1号</span>
          </div>
          <div class="content-box countent-style">
            <img src="/media/icon/relation-icon2.png" class="icon-style" />
            <span>
              15000159790
              <br />
            </span>
          </div>
          <div class="content-box countent-style">
            <img src="/media/icon/relation-icon3.png" class="icon-style" />
            <span>dirui@bujiaban.com</span>
            <br />
          </div>
          <br />
        </section>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import '@/assets/font/font.css'
export default {
  name: 'Relation',
  props: {
    isBlack: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/responsive-style.scss';
@import '~@/styles/publicity-position.scss';
.section-box {
  padding: 8% 4% 6%;
}

.reletion-title-blue {
  font-size: 32px;
  font-weight: 400;
  color: #00cccc;
  margin-bottom: 35px;
}
.reletion-title-black {
  font-size: 32px;
  font-weight: 400;
  color: #1d1d1f;
  margin-bottom: 35px;
}
.reletion-title-small {
  margin-bottom: 8px;
}

.reletion-box {
  word-wrap: break-word;
  margin-bottom: 30px;
}
.countent-style {
  display: flex;
  align-items: center;
}
.content-box {
  text-align: justify;
  letter-spacing: 2px;
  line-height: 40px;
}
.icon-style {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}
</style>
