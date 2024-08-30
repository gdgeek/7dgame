<template>
  <!-- 医疗产品列 -->
  <div class="background-box">
    <div v-for="(item, index) in items" :key="item.title">
      <el-row v-if="index % 2 === 0" class="p-pc-pfr">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <div class="medical-pic-box">
            <img
              src="/media/bg/m-list.jpg"
              style="width: 86%; border-radius: 5px"
            />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <div class="background-text content-color" align="left">
            <h2 class="p-title-m">{{ item.title }}</h2>
            <h5>
              {{ item.text }}
            </h5>
          </div>
          <div align="left" class="button-box">
            <div class="product-button" @click="goto('/web/list-product')">
              价格详情
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-else class="p-pc-pfr">
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="12"
          :xl="12"
          class="hidden-lg-and-up"
        >
          <div class="medical-pic-box">
            <img
              src="/media/bg/m-list2.jpg"
              style="width: 86%; border-radius: 5px"
            />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <div class="background-text content-color" align="left">
            <h2 class="p-title-m">{{ item.title }}</h2>
            <h5>
              {{ item.text }}
            </h5>
          </div>
          <div align="left" class="button-box">
            <div class="product-button" @click="goto('/web/list-product')">
              价格详情
            </div>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="12"
          :xl="12"
          class="hidden-md-and-down"
        >
          <div class="medical-pic-box">
            <img
              src="/media/bg/m-list2.jpg"
              style="width: 86%; border-radius: 5px"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import '@/assets/font/font.css'
import 'element-ui/lib/theme-chalk/display.css'
export default {
  name: 'PublickList',
  props: {
    items: {
      type: Array,
      default: [
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
  },
  data() {
    return {}
  },
  methods: {
    goto(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/responsive-style.scss';
@import '~@/styles/publicity-position.scss';
.background-box {
  padding: 5% 0 60px;
  background-color: #f7f6f9;
}
.medical-pic-box {
  display: flex;
  align-items: center;
  justify-content: center;
  // background-color: pink;
  padding: 30px 20px;
}
.background-text {
  padding: 14% 20% 0 12%;
  // color: #1d1d1f;
}
.background-img {
  position: relative;
  width: 100%;
  height: 50vw;
  max-height: 500px;
}
.button-box {
  padding: 2% 12% 50px;
}
.product-button {
  font-size: 16px;
  line-height: 42px;
  text-align: center;
  font-weight: 400;
  border-radius: 5px;
  color: #fff;
  width: 130px;
  height: 42px;
  background-color: #00cccc;
}
.product-button:hover {
  cursor: pointer;
  opacity: 0.8;
}
</style>
