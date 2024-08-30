<template>
  <div>
    <el-tooltip
      v-if="category"
      :content="category.description"
      placement="top"
      effect="light"
    >
      <el-tag size="mini" style="margin-left: 68px; margin-bottom: 15px">
        {{ category.name }}
      </el-tag>
    </el-tooltip>
    <el-timeline v-if="data" :reverse="reverse">
      <el-timeline-item
        v-for="(item, index) in data"
        :key="index"
        :timestamp="dateTime(new Date(item.date))"
      >
        <el-card
          :body-style="{ padding: '0px' }"
          shadow="hover"
          class="document-box-card"
        >
          <div style="padding: -10px" @click="select(item.id)">
            <img
              align="left"
              class="document-list-img"
              style=""
              :src="item.jetpack_featured_media_url"
              fit="cover"
            />
            <div class="document-list-text">
              <h3 v-html="item.title.rendered" />
              <div v-html="item.excerpt.rendered" />
            </div>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <el-timeline v-else>
      <el-timeline-item>
        <el-skeleton :rows="3" />
      </el-timeline-item>
      <el-timeline-item>
        <el-skeleton :rows="3" />
      </el-timeline-item>
    </el-timeline>
    <el-pagination
      v-if="pagination.count > 1"
      :current-page="pagination.current"
      :page-count="pagination.count"
      :page-size="pagination.size"
      :total="pagination.total"
      layout="prev, pager, next, jumper"
      background
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import moment from 'moment'
moment.locale('zh-cn')
import { Posts, getCategory } from '@/api/wordpress.js'
export default {
  name: 'DocumentList',
  props: {
    categoryId: {
      type: Number,
      required: true
    },
    document_path: {
      type: String,
      default: '/home/document'
    }
  },
  data() {
    return {
      reverse: false,
      category: null,
      data: null,
      pagination: { current: 1, count: null, size: 10, total: null }
    }
  },
  computed: {},
  created: function () {
    const self = this
    getCategory(this.categoryId).then(ret => {
      self.category = ret.data
    })
    this.refresh()
  },
  methods: {
    refresh() {
      const self = this
      Posts(
        self.categoryId,
        self.pagination.size,
        self.pagination.current
      ).then(ret => {
        self.data = ret.data

        self.pagination = {
          current: self.pagination.current,
          count: parseInt(ret.headers['x-wp-totalpages']),
          size: self.pagination.size,
          total: parseInt(ret.headers['x-wp-total'])
        }
      })
    },
    handleCurrentChange: function (page) {
      this.pagination.current = page
      this.refresh()
    },
    dateTime(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    select(id) {
      this.$router.push({ path: this.document_path, query: { id } })
    }
  }
}
</script>

<style lang="scss" scoped>
.document-box-card {
  cursor: pointer;
  margin: 0px;

  // outline: dashed 1px black;
  /* Setup */
  //position: relative;
}
.document-list-img {
  height: 100px;
  border-radius: 4px;
  margin: 0px;
  margin-right: 20px;
  margin-left: 20px;
  margin-bottom: 10px;
  // outline: dashed 1px black;
  /* Setup */
  //position: relative;
}
.document-list-text {
  margin: 20px;
  margin-right: 20px;
  margin-left: 20px;
  // outline: dashed 1px black;
  /* Setup */
  //position: relative;
}
</style>
