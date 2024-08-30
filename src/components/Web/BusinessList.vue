<template>
  <div class="background-box" align="center">
    <div v-for="(item, index) in items" :key="item.title">
      <el-row v-if="index % 2 === 0">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <div class="background-img">
            <el-image
              style="width: 100%; height: 300px; border-radius: 10px"
              fit="cover"
              :src="item.image"
              lazy
            />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <div class="background-text" align="left">
            <h2>{{ item.title }}</h2>
            <h5 class="font-text" style="font-size: 16px">
              {{ item.text }}
            </h5>
          </div>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="12"
          :xl="12"
          class="hidden-lg-and-up"
        >
          <div class="background-img">
            <el-image
              style="width: 100%; height: 300px; border-radius: 10px"
              fit="cover"
              :src="item.image"
              lazy
            />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <div class="background-text" align="left">
            <h2>{{ item.title }}</h2>
            <h5>
              {{ item.text }}
            </h5>
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
          <div class="background-img">
            <el-image
              style="width: 100%; height: 300px; border-radius: 10px"
              fit="cover"
              :src="item.image"
              lazy
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
  name: 'BusinessList',
  props: {
    items: {
      type: Array,
      default: [
        {
          title: '快速分析了解您的需求',
          text: '资深专业人员将对您的需求进行详细了解，发送我们的案例给您参考，为您的绝妙创意提供最适合的解决方案，并全程为项目的实现提供咨询。',
          image: '/media/bg/business1.jpg'
        },
        {
          title: '定制开发demo，5000元直接赠送',
          text: '我们将为您选择的案例提供Demo和报价。为下一步开发打好基础。如果您对我们的demo满意，当我们达成合作进行开发，5000可抵扣工程款。',
          image: '/media/bg/business2.jpg'
        },
        {
          title: '开发完成后的技术支持',
          text: ' 当开发完成验收后，您有任何疑问，我们都会有专家及时帮助您，如果您有需要，我们将会派出专业人员实地提供技术指导。',
          image: '/media/bg/business3.jpg'
        }
      ]
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.background-box {
  padding: 50px 0;
  // 浅色调
  // background-color:#f5f5f7;
  // 深色复合调，下面两个一起用
  background: rgb(33, 33, 33);
  background: linear-gradient(
    20deg,
    rgba(33, 33, 33, 1) 21%,
    rgba(122, 122, 122, 1) 97%
  );
}
.background-text {
  padding: 60px 50px 80px 60px;
  // color: #040707;
  // 浅色字体
  color: whitesmoke;
}
.background-img {
  text-align: center;
  height: 336px;
  width: 85%;
}
.portal-main-background {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}

.abc {
  font-family: 'SmileySans-Oblique';
}
// .content-contact{
//   align-items:center;
//   padding: 150px 112px 0 0;
//   font-size: 20px;
//   line-height:20px;
// }
</style>
