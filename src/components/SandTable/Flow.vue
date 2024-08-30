<template>
  <!-- 开发流程板块 -->
  <section class="sandtable-section">
    <div align="center">
      <h1 class="p-title-m" style="color: #4183ea">项目开发流程</h1>
      <h4>专注开发效率和用户体验，不断优化流程、提升项目质量</h4>
      <p class="section-underline-style" />
    </div>

    <div style="min-height: 350px; margin-top: 40px" align="left">
      <el-row :gutter="10">
        <!-- 开发流程图 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <div
            style="background-color: #f8f8f8; padding: 30px"
            class="section-radius"
          >
            <img src="/media/bg/business3.jpg" style="width: 100%" />
            <h4 style="padding-top: 20px">
              我们拥有超过100个HoloLens
              项目开发的经验,丰富的经验和资源让我们在开发过程中可以避开误区，有效节约成本，优化流程效率，客户满意度更高！
            </h4>
          </div>
          <br />
        </el-col>
        <!-- 开发流程 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-timeline>
            <el-timeline-item timestamp="步骤一" placement="top">
              <div class="section-radius timeline-content">
                <b>需求分析：</b>
                <p class="section-content-size">
                  提供您的绝妙创意，我们将分析您的需求，为您提供解决方案,如需现场进行演示和勘察，我们将派专
                  家实地交流。
                </p>
              </div>
            </el-timeline-item>
            <el-timeline-item timestamp="步骤二" placement="top">
              <div class="section-radius timeline-content">
                <b>定制报价:</b>
                <p class="section-content-size">
                  我们将根据用户实际需要，悉心为您定制DEMO和报价，并解答相关问题，为
                  下一步的开发做好准备。
                </p>
              </div>
            </el-timeline-item>
            <el-timeline-item timestamp="步骤三" placement="top">
              <div class="section-radius timeline-content">
                <b>签订合同:</b>
                <p class="section-content-size">
                  如果您对报价满意，签订合同后，我们将保质保量的进行开发，您可以随时掌握到我们的开发方向和内容，期待您的建议！
                </p>
              </div>
            </el-timeline-item>
            <el-timeline-item timestamp="步骤四" placement="top">
              <div class="section-radius timeline-content">
                <b>验收帮助:</b>
                <p class="section-content-size">
                  我们将根据用户实际需要，悉心为您定制DEMO和报价，解答相关问题，为
                  下一步的开发做好准备。
                </p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Flow',

  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/responsive-style.scss';
@import '~@/styles/sandtable.scss';
.timeline-content {
  background-color: #f8f8f8;
  padding: 20px 20px 10px;
}
</style>
