<template>
  <!-- 应用场景组件 -->
  <section class="section-box">
    <el-row :gutter="30">
      <!-- content部分 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" align="center">
        <div class="title-box content-color" align="left">
          <div class="medical-title-h3 p-title-m">定制开发实景AR展馆体验</div>

          <p class="medical-content-small p-title-ss">
            提供您的绝妙创意，我们将分析您的需求，为您提供解决方案,如需现场进行演示和勘察，我们将派专家实地交流。
          </p>
          <p class="medical-content-small p-title-ss">
            我们将根据用户实际需要，为您选择的展馆案例提供Demo和报价。当开发完成验收后，您有任何疑问，我们将会派出专业人员进行协助，或实地提供技术指导。
          </p>
          <div align="left" class="button-box">
            <a
              href="https://space.bilibili.com/20959246/channel/seriesdetail?sid=352585"
              target="_blank"
              class="link"
            >
              <div class="product-button">更多案例</div>
            </a>
          </div>
        </div>
      </el-col>
      <!-- 视频位置 -->
      <!-- 跳转B站播放视频，带封面 -->
      <el-col align="center" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <a
          href="https://www.bilibili.com/video/BV1v3411f7Qg/?spm_id_from=333.999.0.0&vd_source=69755f47d8a89ee3b37b00151a7cfeed"
          target="_blank"
          class="link"
        >
          <div class="medical-video-box">
            <img
              src="/media/bg/exhibition-play.jpg"
              style="width: 100%; border-radius: 5px"
            />
          </div>
        </a>
      </el-col>
      <!-- 页面直接播放，公用video组件 -->
      <!-- <el-col align="center" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <div class="medical-video-box">
          <simple-video :vdsrc="videoSrc" />
        </div>
      </el-col> -->

      <!-- 页面直接播放B站视频 -->
      <!-- <el-col align="center" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
           <iframe
            src="//player.bilibili.com/player.html?aid=432949605&bvid=BV1v3411f7Qg&cid=900799370&page=1"
            width="100%"
            height="350px"
            scrolling="no"
            border="0"
            frameborder="no"
            framespacing="0"
            allowfullscreen="true"
          />
      </el-col> -->
    </el-row>
    <br />
    <br />
  </section>
</template>

<script>
import '@/assets/font/font.css'
// import SimpleVideo from '@/components/WebPublick/SimpleVideo.vue'
export default {
  name: 'ExhibitionVideo',
  // components: { SimpleVideo },
  data() {
    return {
      // videoSrc:
      //   'http://1251022382.vod2.myqcloud.com/3ebf9041vodtransgzp1251022382/6487c9fd5285890809258783935/v.f30.mp4'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/responsive-style.scss';
@import '~@/styles/publicity-position.scss';
.section-box {
  padding: 6% 5% 60px;
  background-color: #f5f4f3;
}
.title-box {
  width: 100%;
  padding: 2% 30px;
  max-width: 600px;
}
.medical-video-box {
  padding: 2% 30px;
  max-width: 600px;
  width: 100%;
}
.medical-title-h3 {
  padding-bottom: 10px;
  font-size: 32px;
  font-weight: 400;
}
.medical-title-small {
  color: #5a5a5b;
  font-weight: lighter;
  padding: 10px 0 10px;
  font-size: 16px;
}
.medical-content-small {
  color: #444850;
  font-weight: lighter;
  font-size: 18px;
  line-height: 24px;
}
.videobox {
  height: 400px;
}

.button-box {
  padding: 35px 0 15px;
}
.product-button {
  font-size: 16px;
  line-height: 50px;
  text-align: center;
  font-weight: 400;
  border-radius: 5px;
  color: #fff;
  width: 190px;
  height: 50px;
  background-color: #2a2324;
}
</style>
