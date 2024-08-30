<template>
  <div>
    <el-card v-if="data" shadow="never">
      <div slot="header">
        <h2 id="title" v-html="data.title.rendered" />
        <span v-if="category">
          <router-link
            v-for="(item, index) in data._embedded['wp:term'][0]"
            :key="index"
            :to="category_path + '?id=' + item.id"
            style="margin-right: 10px"
          >
            <el-tag size="mini">{{ item.name }}</el-tag>
          </router-link>
        </span>
      </div>
      <div>
        <main style="margin-top: 15px">
          <p
            id="content"
            class="text-muted well well-sm no-shadow"
            style="margin: 20px"
            v-html="data.content.rendered"
          />
        </main>
      </div>
      <br />
      <small id="date" class="pull-right">{{ dateTime(data.date) }}</small>
    </el-card>

    <el-card v-else shadow="never">
      <div slot="header">
        <el-skeleton :rows="1" />
      </div>
      <el-skeleton :rows="20" />
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
moment.locale('zh-cn')
import { Article } from '@/api/wordpress.js'
export default {
  name: 'Document',
  props: {
    postId: {
      type: Number,
      required: true
    },
    category_path: {
      type: String,
      default: '/home/category'
    },
    category: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      data: null
    }
  },

  computed: {
    ...mapState({
      document: state => state.document.index
    })
  },
  created: function () {
    Article(this.postId).then(response => {
      this.title = response.data.title.rendered
      this.content = response.data.content.rendered
      this.data = response.data
    })
  },
  methods: {
    dateTime(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
