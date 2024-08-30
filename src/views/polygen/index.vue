<template>
  <div class="project-index">
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
            <router-link to="/polygen/upload">
              <el-button size="mini" type="primary" icon="el-icon-upload">
                <span class="hidden-sm-and-down">上传模型</span>
              </el-button>
            </router-link>
          </el-button-group>
        </mr-p-p-header>
      </el-header>
      <el-main>
        <el-row :gutter="10">
          <el-col
            v-for="(item, index) in items"
            :key="index"
            :data="item"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <mr-p-p-card
              :item="item"
              @named="namedWindow"
              @deleted="deletedWindow"
            >
              <router-link slot="enter" :to="'/polygen/view?id=' + item.id">
                <el-button-group :inline="true">
                  <el-button
                    v-if="item.info === null || item.image === null"
                    type="warning"
                    size="mini"
                  >
                    初始化模型数据
                  </el-button>
                  <el-button v-else type="primary" size="mini">
                    查看模型
                  </el-button>
                </el-button-group>
              </router-link>
            </mr-p-p-card>
            <br />
          </el-col>
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
import 'element-ui/lib/theme-chalk/index.css'
import { getPolygens, putPolygen, deletePolygen } from '@/api/resources'
import MrPPCard from '@/components/MrPP/MrPPCard'
import MrPPHeader from '@/components/MrPP/MrPPHeader'
export default {
  components: {
    MrPPCard,
    MrPPHeader
  },
  data() {
    return {
      items: null,
      sorted: '-created_at',
      searched: '',
      pagination: { current: 1, count: 1, size: 20, total: 20 }
    }
  },

  created: function () {
    this.refresh()
  },
  methods: {
    handleCurrentChange: function (page) {
      this.pagination.current = page
      this.refresh()
      console.log(this.pagination.current)
    },
    namedWindow: function (item) {
      const self = this
      this.$prompt('请输入新名称', '修改模型名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputValue: item.name
      })
        .then(({ value }) => {
          self.named(item.id, value)
          this.$message({
            type: 'success',
            message: '新的模型名称: ' + value
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
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
      const polygen = { name: newValue }
      putPolygen(id, polygen)
        .then(response => {
          self.refresh()
        })
        .catch(err => {
          console.log(err)
        })
    },
    deletedWindow: function (item) {
      const self = this
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(() => {
          self.deleted(item.id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    deleted: function (id) {
      const self = this

      deletePolygen(id)
        .then(response => {
          self.refresh()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    succeed: function (data) {
      console.log(data)
      this.items = data
    },
    refresh() {
      const self = this
      getPolygens(self.sorted, self.searched, self.pagination.current)
        .then(response => {
          console.log(response.headers)
          self.pagination = {
            current: parseInt(response.headers['x-pagination-current-page']),
            count: parseInt(response.headers['x-pagination-page-count']),
            size: parseInt(response.headers['x-pagination-per-page']),
            total: parseInt(response.headers['x-pagination-total-count'])
          }
          if (response.data) {
            self.succeed(response.data)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>
