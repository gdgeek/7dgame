<template>
  <div class="verse-index">
    <create
      v-if="created"
      ref="createdDialog"
      :close-on-click-modal="false"
      :dialog-title="'创建！【宇宙】'"
      dialog-submit="创 建"
      @submit="(form, item, imageId) => submitCreate(form, imageId)"
    />

    <br />
    <el-container>
      <el-header>
        <mr-p-p-header
          :sorted="sorted"
          :searched="searched"
          @search="search"
          @sort="sort"
        >
          <el-button-group :inline="true">
            <el-button
              v-if="created"
              size="mini"
              type="primary"
              @click="createWindow()"
            >
              <font-awesome-icon icon="plus" />
              &nbsp;
              <span class="hidden-sm-and-down">创建【宇宙】</span>
            </el-button>
          </el-button-group>
        </mr-p-p-header>
      </el-header>
      <el-main>
        <el-row>
          <verse-list :items="items" @refresh="refresh" />
        </el-row>
      </el-main>
      <el-footer>
        <el-card class="box-card">
          <el-pagination
            :current-page="pagination.current"
            :page-count="pagination.count"
            :page-size="pagination.size"
            :total="pagination.total"
            layout="prev, pager, next, jumper"
            background
            @current-change="handleCurrentChange"
          />
        </el-card>
      </el-footer>
    </el-container>
    <br />
  </div>
</template>

<script>

import { v4 as uuidv4 } from 'uuid'
import 'element-ui/lib/theme-chalk/index.css'
import { postVerse, putVerse } from '@/api/v1/verse'
import VerseList from '@/components/MrPP/MrPPVerseList'
import MrPPHeader from '@/components/MrPP/MrPPHeader'
import Create from '@/components/MrPP/MrPPVerseWindow/Create.vue'

export default {
  name: 'VerseEditor',
  components: {
    VerseList,
    MrPPHeader,
    Create
  },

  props: {
    created: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      items: null,
      sorted: '-created_at',
      searched: '',
      pagination: { current: 1, count: 1, size: 20, total: 20 }
    }
  },
  computed: {
    dialogTitle() {
      return ''
    }
  },
  created: function () {
    this.refresh()
  },

  methods: {
    createWindow() {
      this.$refs.createdDialog.$emit('show')
    },
    polygenWindow() {
      this.$refs.polygenDialog.$emit('show')
    },
    infoTable(item) {
      const table = []
      const info = JSON.parse(item.info)
      if (info !== null) {
        table.push({
          value: '内容说明：' + info.description
        })
      }
      return table
    },
    submitCreate(form, imageId) {
      const self = this

      const data = { name: form.name, info: JSON.stringify(form), uuid:uuidv4() }
      if (imageId !== null) {
        data.image_id = imageId
      }

      postVerse(data).then(response => {
        console.log(response.data.id)
        self.$router.push({
          path: '/verse/scene',
          query: { id: response.data.id }
        })
      })
    },
    handleCurrentChange: function (page) {
      this.pagination.current = page
      this.refresh()
      console.log(this.pagination.current)
    },
    sort: function (value) {
      this.sorted = value
      this.refresh()
    },
    search: function (value) {
      this.searched = value
      this.refresh()
    },
    named: function (id, newValue) {
      const self = this
      const verse = { name: newValue }
      putVerse(id, verse)
        .then(response => {
          self.refresh()
        })
        .catch(err => {
          console.log(err)
        })
    },
    refresh() {
      const self = this
      self.$emit(
        'loaded',
        {
          sorted: self.sorted,
          searched: self.searched,
          current: self.pagination.current
        },
        val => {
          self.items = val.data
          self.pagination = val.pagination
        }
      )
    }
  }
}
</script>
