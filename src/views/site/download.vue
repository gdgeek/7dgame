<template>
  <div class="screen-main-height">
    <el-card class="card">
      <document-list :category-id="77" :document_path="'/web/document'" />
    </el-card>
  </div>
</template>

<script>
import DocumentList from '@/components/Home/DocumentList.vue'
// @ is an alias to /src
export default {
  name: 'WebDownload',
  components: {
    DocumentList
  }
}
</script>

<style lang="scss" scoped>
.screen-main-height {
  min-height: calc(100vh - 130px);
}
.card {
  font-size: 14px;
  margin: 20px;
  color: #666;

  //background: url('/media/bg/03.jpg')  center no-repeat;
  //background-attachment: fixed;
  //background-size: cover;
}
</style>
