<template>
  <div class="background-screen-border">
    <Giant></Giant>

    <el-card class="box-card"></el-card>

    <el-card class="box-card">
      <br />
      <book
        document_path="/blog/document"
        :items="book"
        category_path="/blog/category"
      />
      <!-- -->
    </el-card>
    <br />
    <el-card class="box-card">
      <cards />
    </el-card>
  </div>
</template>

<script>
import Giant from '@/components/Web/Giant'
import Book from '@/components/Book.vue'

import Cards from '@/components/Web/Cards'

export default {
  name: 'WebIndex',
  components: {
    Cards,
    Giant,
    Book
  },
  data() {
    return {
      book: [{ label: '元气弹执行计划', type: 'category', id: 87 }]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/screenstyle.scss';
</style>
