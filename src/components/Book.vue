<template>
  <el-tabs type="border-card" lazy>
    <el-tab-pane v-for="item in items" :key="item.label" :label="item.label">
      <document
        v-if="item.type === 'document'"
        :post-id="item.id"
        :category="category"
        :category_path="category_path"
      />
      <document-list
        v-if="item.type === 'category'"
        :category-id="item.id"
        :document_path="document_path"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Document from '@/components/Document.vue'
import DocumentList from '@/components/Home/DocumentList.vue'
export default {
  name: 'DocumentIndex',
  components: {
    Document,
    DocumentList
  },
  props: {
    items: {
      type: Array,
      default: [
        { label: '首页', type: 'document', id: 999 },
        { label: '新闻', type: 'category', id: 74 },
        { label: '相关下载', type: 'category', id: 84 },
        { label: '案例教程', type: 'category', id: 79 }
      ]
    },
    document_path: {
      type: String,
      default: '/home/document'
    },
    category_path: {
      type: String,
      default: '/home/category'
    },
    category: {
      type: Boolean,
      default: true
    }
  }
}
</script>
