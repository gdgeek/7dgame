<template>
  <div class="background-screen-border">
    <giant />

    <el-card class="box-card">
      <!-- -->
    </el-card>
    <cards />
    <business-list :items="list" />
    <contact />
    <Partner />
    <book
      document_path="/web/document"
      :items="book"
      category_path="/web/category"
    />
  </div>
</template>

<script>
import Giant from '@/components/Web/Giant'
import Cards from '@/components/Web/Cards'
import BusinessList from '@/components/Web/BusinessList.vue'
import Contact from '@/components/Web/Contact'
import Partner from '@/components/Web/Partner'
import Cooperation from '@/components/Web/Cooperation'
import Carousel from '@/components/Web/Carousel'
import Book from '@/components/Book.vue'
export default {
  name: 'WebIndex',
  components: {
    Giant,
    Cards,
    BusinessList,
    Contact,
    Partner,
    Cooperation,
    Carousel,
    Book
  },
  data() {
    return {
      book: [
        { label: '新闻', type: 'category', id: 74 },
        { label: '案例教程', type: 'category', id: 79 }
      ],
      list: [
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
          text: '当开发完成验收后，您有任何疑问，我们都会有专家及时帮助您，如果您有需要，我们将会派出专业人员实地提供技术指导。',
          image: '/media/bg/business3.jpg'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/screenstyle.scss';
</style>
