<template>
  <div>
    <knight-data-dialog ref="knightData" @submit="knightDataSubmit" />
  
    <el-dialog
      :visible.sync="dialogVisible"
      width="95%"
      height="95px"
      :show-close="false"
      @close="cancel()"
    >
      <span slot="title" class="dialog-footer">
        <el-tabs
          v-model="activeName"
          type="card"
          class="demo-tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane label="系统预设" name="prefab"  />
          <el-tab-pane label="本地数据" name="custom" />
        </el-tabs>
        <mr-p-p-header
          :sorted="active.sorted"
          :searched="active.searched"
          @search="search"
          @sort="sort"
        >
          <el-tag>
            <b>选择元数据</b>
          </el-tag>
            
        </mr-p-p-header>
        <el-divider content-position="left">
          <el-tag
            v-if="prefab.searched !== ''"
            size="mini"
            closable
            @close="clearSearched()"
          >
            {{ prefab.searched }}
          </el-tag>
        </el-divider>
      </span>
      <waterfall v-if="prefab !== null && prefab.items !== null" :options="{}">
        <waterfall-item
          v-for="(item, index) in prefab.items"
          :key="index"
          style="width: 230px"
        >
          <el-card style="width: 220px" class="box-card">
            <div slot="header">
              <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <span slot="header" class="mrpp-title">
                  <b class="card-title" nowrap>{{ title(item) }}</b>
                </span>
                <img
                  v-if="item.image"
                  style="width: 100%; height: 180px"
                  fit="contain"
                  :src="item.image.url"
                  lazy
                />

                <div style="width: 100%; text-align: center">
                  {{ item.created_at }}
                </div>
              </el-card>
            </div>
            <div class="clearfix">
              <el-button size="mini" @click="doSelect(item)">选择</el-button>
            </div>
            <div class="bottom clearfix" />
          </el-card>

          <br />
        </waterfall-item>
      </waterfall>
      <template v-else>
        <el-skeleton />
      </template>

      <span slot="footer" class="dialog-footer">
        <el-row :gutter="0">
          <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
            <el-pagination
              :current-page="active.pagination.current"
              :page-count="active.pagination.count"
              :page-size="active.pagination.size"
              :total="active.pagination.total"
              layout="prev, pager, next, jumper"
              background
              @current-change="handleCurrentChange"
            />
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-button-group>
              <el-button v-if="activeName == 'custom' " type="success" size="mini" @click="create">
                新 建
              </el-button>
              <el-button size="mini" @click="dialogVisible = false">
                取 消
              </el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Waterfall, WaterfallItem } from 'vue2-waterfall'
import KnightDataDialog from '@/components/MrPP/KnightDataDialog.vue'

import { v4 as uuidv4 } from 'uuid'

import { getMetas, postMeta } from '@/api/v1/meta'
import { getPrefabs } from '@/api/v1/prefab'


import MrPPHeader from '@/components/MrPP/MrPPHeader'
export default {
  name: 'KnightDialog',
  components: {
    Waterfall,
    WaterfallItem,
    MrPPHeader,
    KnightDataDialog
  },
  data() {
    return {
      activeName: 'prefab',
      verse_id: -1,
      value: null,

      prefab: {
        items: null,
        sorted: '-created_at',
        searched: '',
        pagination: { current: 1, count: 1, size: 20, total: 20 }
      },
      custom: {
        items: null,
        sorted: '-created_at',
        searched: '',
        pagination: { current: 1, count: 1, size: 20, total: 20 }
      },
      dialogVisible: false
    }
  },
  props: {},
  computed: {
    active() {
      if (this.activeName === 'prefab') {
        return this.prefab
      }
      return this.custom
    }
  },
  methods: {
    knightDataSubmit(data) {
      console.error(data)
    },
    handleClick(tab, event) {
      this.refresh()
    },
    title(item) {
      if (item.title !== undefined) {
        return item.title
      }

      if (item.name !== undefined) {
        return item.name
      }
      return 'title'
    },
    async open(value, verse_id) {
      this.prefab = {
        items: null,
        sorted: '-created_at',
        searched: '',
        pagination: { current: 1, count: 1, size: 20, total: 20 }
      }
      this.custom = {
        items: null,
        sorted: '-created_at',
        searched: '',
        pagination: { current: 1, count: 1, size: 20, total: 20 }
      }
      this.verse_id = verse_id
      this.value = value

      this.refresh()

      this.dialogVisible = true
    },
    async refreshPrefab() {
      const response = await getPrefabs(
        this.prefab.sorted,
        this.prefab.searched,
        this.prefab.pagination.current,
        'image'
      )
      this.prefab.items = response.data
    },
    async refreshCustom() {
      const response = await getMetas(
        this.custom.sorted,
        this.custom.searched,
        this.custom.pagination.current,
        'image'
      )

      this.prefab.items = response.data
    },
    close() {
      this.dialogVisible = false
    },
    sort: function (value) {
      
      this.active.sorted = value
      this.refresh()
    },
    search: function (value) {
      this.active.searched = value
      this.refresh()
    },
    clearSearched() {
      this.active.searched = ''
      this.refresh()
    },
    doSelect(data) {
    
      if (data.custom === 1) {
       // alert(data)
       this.$emit('selected', { data })
        this.dialogVisible = false
     } else {

      if(data.data != null){
        this.$refs.knightData.open({
          schema: JSON.parse(data.data),
          data: {},
          callback: (setup) => {
            this.$emit('selected', {data, setup})
            this.dialogVisible = false
          }
        })
      }else{
        this.$emit('selected', { data, setup: {} })
        this.dialogVisible = false
      }
    
     }
   
    },
    doEmpty() {
      this.$emit('selected', null)
      this.value = null
      this.dialogVisible = false
    },

    selected(data = null) {
      this.$emit('selected', data)
      this.dialogVisible = false
    },
    create() {
      postMeta({
        title: '新建元数据',
        custom: 1,
        uuid: uuidv4()
      }).then(response => {
        this.selected({data: response.data })
        this.dialogVisible = false
      })
    },
    cancel() {
      this.$emit('cancel')
    },
    handleCurrentChange: function (page) {
      this.active.pagination.current = page
      this.refresh()
    },
    async refresh() {
      if (this.activeName === 'prefab') {
        this.refreshPrefab()
      } else {
        this.refreshCustom()
      }
    
      
    }
  }
}
</script>
