<template>
  <div v-loading="loading" class="document-index">
    <el-row :gutter="20" style="margin: 28px 18px 0">
      <el-col :sm="16">
        <el-card class="box-card">
          <div slot="header">
            <b id="title">体素名称：</b>
            <span v-if="data">{{ data.name }}</span>
          </div>
          <div v-loading="false" class="box-item">
            <Voxel
              v-if="data"
              ref="three"
              :file="data.file"
              @loaded="loaded"
              @progress="progress"
            />
          </div>
          <el-progress :percentage="percentage" />
        </el-card>
        <br />

        <el-card v-loading="false" class="box-card">
          <el-button
            style="width: 100%"
            type="primary"
            size="mini"
            @click="createVerse()"
          >
            <font-awesome-icon icon="plus" />
            &nbsp;用体素创建【宇宙】
          </el-button>
        </el-card>

        <br />
      </el-col>

      <el-col :sm="8">
        <el-card class="box-card">
          <div slot="header">
            <b>体素信息</b>
            :
          </div>
          <div class="box-item">
            <el-table :data="tableData" stripe>
              <el-table-column prop="item" label="条目" />
              <el-table-column prop="text" label="内容" />
            </el-table>

            <aside style="margin-top: 10px; margin-bottom: 30px">
              <el-button-group style="float: right">
                <el-button type="primary" size="mini" @click="namedWindow()">
                  <i class="el-icon-edit" />
                  改名
                </el-button>
                <el-button type="primary" size="mini" @click="deleteWindow()">
                  <i class="el-icon-delete" />
                  删除
                </el-button>
              </el-button-group>
            </aside>
          </div>
        </el-card>
        <br />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getVoxel, putVoxel, deleteVoxel } from '@/api/resources'
import { createVerseFromResource } from '@/api/v1/meta-verse'

import { postFile } from '@/api/v1/files'
import { printVector3 } from '@/assets/js/helper'
import { mapState } from 'vuex'
import Voxel from '@/components/Voxel.vue'

export default {
  name: 'VoxelView',
  components: {
    Voxel
  },
  data: function () {
    return {
      loading: false,
      data: null,
      file: null,
      expire: false,
      percentage: 0
    }
  },
  computed: {
    ...mapState({
      store: state => state.config.store
    }),
    tableData() {
      if (this.prepare) {
        const info = JSON.parse(this.data.info)
        return [
          {
            item: '模型名称',
            text: this.data.name
          },

          {
            item: '创建者',
            text: this.data.author.nickname
          },
          {
            item: '创建时间',
            text: this.data.created_at
          },
          {
            item: '文件大小',
            text: this.data.file.size + '字节'
          },
          {
            item: '体素尺寸',
            text: printVector3(info.size)
          },
          {
            item: '体素中心',
            text: printVector3(info.center)
          },
          {
            item: '体素数量',
            text: info.count
          }
        ]
      } else {
        return []
      }
    },
    id() {
      return this.$route.query.id
    },
    prepare() {
      return this.data != null && this.data.info !== null
    },
    dataInfo() {
      if (this.prepare) {
        return JSON.parse(this.data.info)
      }
      return null
    },
    meshSize() {
      if (this.prepare) {
        return this.dataInfo.size
      }
      return '等待更新'
    },
    meshCenter() {
      if (this.prepare) {
        return this.dataInfo.center
      }
      return '等待更新'
    }
  },
  created: async function () {
    const self = this
    self.expire = true
    const response = await getVoxel(self.id)
    self.data = response.data
  },
  methods: {
    progress(percentage) {
      this.percentage = percentage
    },
    createVerse: async function () {
      const self = this
      await this.$prompt('用此模型创建【宇宙】', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: self.data.name,
        inputErrorMessage: '请填写相应名称'
      })

        .then(async ({ value }) => {
          self.loading = true
          try {
            const data = await createVerseFromResource(
              'Voxel',
              value,
              self.data
            )

            this.$message({
              type: 'success',
              message: '你创建了新的场景: ' + value
            })
            setTimeout(() => {
              this.$router.push('/meta-verse/index')
            }, 300)
          } catch (error) {
            this.$message({
              type: 'error',
              message: '创建失败: ' + error
            })
          }

          self.loading = false
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },
    deleteWindow: function () {
      const self = this
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(() => {
          self.delete(self.data.id)
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
    delete: async function (id) {
      console.log(this.api + '/resources/' + id + '?type=voxel')
      try {
        await deleteVoxel(id)

        this.$router.push({ path: '/voxel/index' })
      } catch (err) {
        console.error(err)
        this.failed(JSON.parse(err.message))
      }
    },
    namedWindow: function () {
      const self = this
      this.$prompt('请输入新名称', '修改模型名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputValue: self.data.name
      })
        .then(({ value }) => {
          self.named(self.data.id, value)
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
    named: async function (id, name) {
      const voxel = { name }
      console.log(voxel)
      try {
        const response = await putVoxel(id, voxel)
        this.data.name = response.data.name
      } catch (err) {
        console.error(err)
      }
    },
    updateVoxel: async function (imageId, info) {
      const voxel = { image_id: imageId, info: JSON.stringify(info) }
      const response = await putVoxel(this.data.id, voxel)
      console.log(response.data)
      this.data.image_id = response.data.image_id
      this.data.info = response.data.info
      console.log(this.dataInfo)
      console.log(this.meshCenter)
      this.expire = false
    },
    saveFile: async function (md5, extension, info, file, handler) {
      const data = {
        md5,
        key: md5 + extension,
        filename: file.name,
        url: this.store.fileUrl(md5, extension, handler, 'screenshot/voxel')
      }

      const response = await postFile(data)
      this.updateVoxel(response.data.id, info)
    },
    
    loaded: async function (info) {
      const self = this
      const store = this.store
      if (self.prepare) {
        self.expire = false
        return
      }
      const blob = await this.screenshot()
      blob.name = self.data.name
      blob.extension = '.jpg'
      const file = blob
      const md5 = await store.fileMD5(file)

      const handler = await store.publicHandler()

      const has = await store.fileHas(
        md5,
        file.extension,
        handler,
        'screenshot/voxel'
      )
      if (!has) {
        await store.fileUpload(
          md5,
          file.extension,
          file,
          p => {},
          handler,
          'screenshot/voxel'
        )
      }

      await self.saveFile(md5, file.extension, info, file, handler)
    },
    
    screenshot: function () {
      return this.$refs.three.screenshot()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/view-style.scss';
</style>
