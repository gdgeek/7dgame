<template>
  <el-card>
    <document-list :category-id="id" :document_path="'/blog/document'" />
  </el-card>
</template>

<script>
import DocumentList from '@/components/Home/DocumentList.vue'
export default {
  name: 'HomeCategory',
  components: {
    DocumentList
  },
  computed: {
    id() {
      return parseInt(this.$route.query.id)
    }
  }
}
</script>
