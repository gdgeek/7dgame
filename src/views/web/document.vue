<template>
  <div>
    <el-card class="card">
      <document :post-id="id" :category_path="category_path" />
    </el-card>
  </div>
</template>

<script>
import Document from '@/components/Document.vue'
// @ is an alias to /src
export default {
  name: 'WebDocument',
  props: {
    category_path: {
      type: String,
      default: '/web/category'
    }
  },
  components: {
    Document
  },
  computed: {
    id() {
      return parseInt(this.$route.query.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  font-size: 14px;
  margin: 20px;
  color: #666;

  //background: url('/media/bg/03.jpg')  center no-repeat;
  //background-attachment: fixed;
  //background-size: cover;
}
</style>
