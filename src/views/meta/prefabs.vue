<template>
  <div>
    <br />
    <el-container>
      <el-header>
        <mr-p-p-header
          :sorted="sorted"
          :searched="searched"
          sortByTime="created_at"
          sortByName="title"
          @search="search"
          @sort="sort"
        >
          <el-button-group :inline="true">
            <el-button  v-if="$can('root')"  size="mini" type="primary" @click="addPrefab()">
              <font-awesome-icon icon="plus" />
           
              <span class="hidden-sm-and-down">创建【元数据】</span>
            </el-button>
          </el-button-group>
        </mr-p-p-header>
      </el-header>
      <el-main>
        <el-row>
          <div v-if="items">
            <waterfall :options="{}">
              <!-- slice Control number of items -->
              <waterfall-item
                v-for="(item, index) in items"
                :key="index"
                style="width: 330px"
              >
                <el-card style="width: 320px" class="box-card">
                  <div slot="header">
                    <el-card shadow="hover" :body-style="{ padding: '0px' }">
                      <span slot="header" class="mrpp-title">
                        <b class="card-title" nowrap>{{ item.title }}</b>
                      </span>
                      <router-link  :to="url(item.id)">
                        <img
                          v-if="item.image === null"
                          src="@/assets/image/none.png"
                          style="
                            width: 100%;
                            height: 270px;
                            object-fit: contain;
                          "
                        />
                        <img
                          v-else
                          style="width: 100%; height: 270px"
                          fit="contain"
                          :src="item.image.url"
                          lazy
                        />
                      </router-link>
                    </el-card>
                  </div>
                  <div class="clearfix">
                      <el-button-group  v-if="$can('root')" style="float: right" :inline="true">
                   

                        <el-button @click="editor(item.id)"  size="mini"> <i class="el-icon-edit" />编辑</el-button>
                     
                        <el-button @click="del(item.id)" size="mini"> <i class="el-icon-delete" />删除</el-button>
                      </el-button-group>
                  
                  </div>
                  <div class="bottom clearfix" />
                </el-card>
                <br />
              </waterfall-item>
            </waterfall>
          </div>
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
  </div>
</template>

<script>
import { Waterfall, WaterfallItem } from 'vue2-waterfall'

import { v4 as uuidv4 } from 'uuid'
import { getPrefabs, postPrefab, deletePrefab } from '@/api/v1/prefab'
import MrPPHeader from '@/components/MrPP/MrPPHeader'
export default {
  name: 'PrefabIndex',
  components: {
    Waterfall,
    WaterfallItem,
    MrPPHeader
  },
  mounted() {
    this.refresh()
  },
  methods: {
    url(id) {
      if (this.$can('root')) { 
        return '/meta/prefab-edit?id=' + id
      }
      return '#'
    },
    editor: function (id) {
      this.$router.push({ path: '/meta/prefab-edit', query: { id } })
    },
    
    async del(id) {
      try {
        await this.$confirm('此操作将永久删除该【元数据】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await deletePrefab(id)

        await this.refresh()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      } catch (e) {
        console.error(e)
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    sort: function (value) {
      this.sorted = value
      this.refresh()
    },
    search: function (value) {
      this.searched = value
      this.refresh()
    },
    async addPrefab() {
      try {
        const input = await this.$prompt('请输元数据名称', '提示(3-20个字符)', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: value => {
            if (!value) {
              return '元数据名称不能为空'
            }
            if (value.length < 2) {
              return '元数据名称不能小于2个字符'
            }
            if (value.length > 20) {
              return '元数据名称不能大于20个字符'
            }
          }
        })
        this.$message({
          type: 'success',
          message: '元数据名称是: ' + input.value
        })

        const data = {
          title: input.value,
          custom: 1,
          uuid:uuidv4()
        }
        const response = await postPrefab(data)
        await this.editPrefab(response.data.id)
      } catch (e) {
        console.error()
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      }
    },
    async editPrefab(id) {
      this.$router.push({ path: '/meta/prefab-edit', query: { id } })
    },
    handleCurrentChange: function (page) {
      this.pagination.current = page
      this.refresh()
    },
    async refresh() {
      const response = await getPrefabs(
        this.sorted,
        this.searched,
        this.pagination.current,
        'image,author'
      )
      
      console.error(response.data)
      this.items = response.data
    }
  },

  data() {
    return {
      items: null,
      sorted: '-created_at',
      searched: '',
      pagination: { current: 1, count: 1, size: 20, total: 20 }
    }
  }
}
</script>
