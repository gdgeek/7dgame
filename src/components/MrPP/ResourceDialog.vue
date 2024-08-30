<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="95%"
      height="100px"
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
          <el-tab-pane label="绑定资源" name="binding" v-if="meta_id != null" />
          <el-tab-pane label="我的资源" name="owner" />

        </el-tabs>
        <mr-p-p-header
          :sorted="active.sorted"
          :searched="active.searched"
          @search="search"
          @sort="sort"
        >
          <el-tag>
            <b>选择资源</b>
          </el-tag>
        </mr-p-p-header>
        <el-divider content-position="left">
          <el-tag
            v-if="active.searched !== ''"
            size="mini"
            closable
            @close="clearSearched()"
          >
            {{ active.searched }}
          </el-tag>
        </el-divider>
      </span>
      <waterfall v-if="active !== null && active.items !== null" :options="{}">
        <waterfall-item
          v-for="(item, index) in active.items"
          :key="index"
          style="width: 230px"
        >
          <el-card
            v-if="activeName === 'owner'"
            style="width: 220px"
            class="box-card"
          >
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
            <div class="clearfix" v-if="meta_id != null">
              <el-button-group v-if="item.id === value">
                <el-button type="warning" size="mini" @click="doEmpty()">
                  取消选择
                </el-button>
              </el-button-group>
              <el-button-group v-else-if="isBinding(item)">
                <el-button type="primary" size="mini" @click="doSelect(item)">
                  选择
                </el-button>
                <el-button type="primary" size="mini" @click="doUnbind(item)">
                  取消绑定
                </el-button>
              </el-button-group>
              <el-button v-else size="mini" @click="doBinding(item)">
                绑定
              </el-button>
            </div>
            <div class="clearfix" v-else>
              <el-button type="primary" size="mini" @click="doSelect(item)">
                选择
              </el-button>
            </div>
            <div class="bottom clearfix" />
          </el-card>
          <el-card v-else style="width: 220px" class="box-card">
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
              <el-button-group v-if="value === null || item.id !== value">
                <el-button type="primary" size="mini" @click="doSelect(item)">
                  选择
                </el-button>
                <el-button type="primary" size="mini" @click="doUnbind(item)">
                  取消绑定
                </el-button>
              </el-button-group>
              <el-button-group v-else>
                <el-button type="warning" size="mini" @click="doEmpty()">
                  取消选择
                </el-button>
              </el-button-group>
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
              <el-button size="mini" @click="selected(null)">清 空</el-button>
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

import { getResources } from '@/api/resources'
import {
  getMetaResources,
  postMetaResource,
  deleteMetaResource
} from '@/api/v1/meta-resource'
import MrPPHeader from '@/components/MrPP/MrPPHeader'
export default {
  name: 'ResourceDialog',
  components: {
    Waterfall,
    WaterfallItem,
    MrPPHeader
  },
  data() {
    return {
      activeName: 'binding',
      type: 'polygen',
      meta_id: null,
      value: null,
      binding: {
        items: null,
        sorted: '-created_at',
        searched: '',
        pagination: { current: 1, count: 1, size: 20, total: 20 }
      },
      owner: {
        items: null,
        sorted: '-created_at',
        searched: '',
        pagination: { current: 1, count: 1, size: 20, total: 20 }
      },
      dialogVisible: false
    }
  },
  computed: {
    active() {
      if (this.activeName === 'binding') {
        return this.binding
      }
      return this.owner
    }
  },
  methods: {
    isBinding(item) {
      for (let i = 0; i < item.metaResources.length; ++i) {
        if (item.metaResources[i].meta_id === this.meta_id) {
          return true
        }
      }
      return false
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
    async openIt({ selected = null, binding = null, type }) {
      await this.open(selected, binding, type)
    },
    async open(value, meta_id = null, type = null) {
     
      this.binding = {
        items: null,
        sorted: '-created_at',
        searched: '',
        pagination: { current: 1, count: 1, size: 20, total: 20 }
      }
      this.owner = {
        items: null,
        sorted: '-created_at',
        searched: '',
        pagination: { current: 1, count: 1, size: 20, total: 20 }
      }

      this.type = type
      this.meta_id = meta_id
      this.value = value

      this.refreshOwner()
      this.refreshBinding().then(() => {
        if (this.binding.items !== null && this.binding.items.length !== 0) {
          this.activeName = 'binding'
        } else {
          this.activeName = 'owner'
        }
      })
      this.dialogVisible = true
    },
    async refreshOwner() {
      const response = await getResources(
        this.type,
        this.owner.sorted,
        this.owner.searched,
        this.owner.pagination.current,
        'image, metaResources'
      )

      this.owner.items = response.data
    },
    async refreshBinding() {
      const response = await getMetaResources(
        this.meta_id,
        this.type,
        this.binding.sorted,
        this.binding.searched,
        this.binding.pagination.current,
        'image,author,metaResources'
      )
      this.binding.items = response.data
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
      this.$emit('selected', data)
      this.dialogVisible = false
    },
    doEmpty() {
      this.$emit('selected', null)
      this.value = null
    },
    async doUnbind(data) {
      try {
        await this.$confirm('是否解除资源绑定?', '解绑资源', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        for (let i = 0; i < data.metaResources.length; ++i) {
          if (data.metaResources[i].meta_id == this.meta_id) {
            await deleteMetaResource(data.metaResources[i].id)
            break
          }
        }
        await this.refresh()
        this.$message({
          type: 'success',
          message: '解绑成功!'
        })
      } catch (e) {
        console.error(e)
        this.$message({
          type: 'info',
          message: '已取消'
        })
      }
    },
    async doBinding(data) {
      try {
        await this.$confirm('是否将资源绑定到场景?', '绑定资源', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const response = await postMetaResource({
          meta_id: this.meta_id,
          resource_id: data.id
        })
        this.refresh()
        this.$message({
          type: 'success',
          message: '绑定成功!'
        })

        await this.$confirm('是否直接确认设置资源?', '确认资源', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.selected(data)
        this.$message({
          type: 'success',
          message: '设置成功!'
        })
      } catch (e) {
        console.error(e)
        this.$message({
          type: 'info',
          message: '已取消'
        })
      }
    },
    selected(data = null) {
      this.$emit('selected', data)
      this.dialogVisible = false
    },
    cancel() {
      this.$emit('cancel')
    },
    handleCurrentChange: function (page) {
      this.active.pagination.current = page
      this.refresh()
    },
    async refresh() {
      if (this.activeName === 'binding') {
        await this.refreshBinding()
        if (this.binding.items === null || this.binding.items.length === 0) {
          await this.refreshOwner()
          this.activeName = 'owner'
        }
      } else {
        await this.refreshOwner()
      }
    }
  }
}
</script>
