<template>
  <div v-loading="loading" class="document-index">
    <el-row :gutter="20" style="margin: 28px 18px 0">
      <el-col :sm="16">
        <el-card class="box-card">
          <div slot="header">
            <b id="title" v-if="data">场景名称：{{ data.title }}</b>
          </div>
          <div v-loading="expire" class="box-item">
            <three
              v-if="data"
              ref="three"
              :file="data.mesh"
              @loaded="loaded"
              @progress="progress"
            />
          </div>
          <el-progress :percentage="percentage" />
        </el-card>
        <br />

        <br />
      </el-col>

      <el-col :sm="8">
        <el-card class="box-card">
          <div slot="header">
            <b>模型信息</b>
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
import { getSpace, putSpace, deleteSpace } from '@/api/v1/space'
//import { createVerseFromResource } from '@/api/v1/meta-verse'

import { postFile } from '@/api/v1/files'
import { mapState } from 'vuex'
import Three from '@/components/Three.vue'

export default {
  name: 'SpaceView',
  components: {
    Three
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
      if (this.data !== null) {
        console.log(JSON.parse(this.data.info))
        return [
          {
            item: '场景标题',
            text: this.data.title
          },
          {
            item: '创建者',
            text: this.data.author.nickname
          },
          {
            item: '创建时间',
            text: this.data.created_at
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
      return this.data.image !== null && typeof this.data.image !== 'undefined'
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
    try {
      const response = await getSpace(self.id, {
        expand: 'author,mesh,sample,image'
      })
      self.data = response.data
    } catch (err) {
      console.log(err)
    }
  },

  methods: {
    progress(percentage) {
      this.percentage = percentage
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
      const self = this

      try {
        const response = await deleteSpace(id)
        self.$router.push({ path: '/polygen/index' })
      } catch (error) {
        console.log(error)
        self.failed(JSON.parse(error.message))
      }
    },
    namedWindow: function () {
      const self = this
      this.$prompt('请输入新名称', '修改模型名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputValue: self.data.title
      })
        .then(({ value }) => {
          self.named(self.data.id, value)
          this.$message({
            type: 'success',
            message: '新的模型名称: ' + value
          })
        })
        .catch(err => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },
    named: async function (id, title) {
      const self = this
      const space = { title }
      try {
        const response = await putSpace(id, space)
        self.data.title = response.data.title
      } catch (err) {
        throw err
      }
    },
    async updateSpace(imageId) {
      const self = this
      return new Promise(async function (resolve, reject) {
        try {
          const response = await putSpace(self.data.id, { image_id: imageId })

          self.data.image_id = response.data.image_id
          self.data.info = response.data.info
          self.expire = false
          resolve(response.data)
        } catch (err) {
          reject(err)
        }
      })
    },
    async saveFile(md5, extension, info, file, handler) {
      const self = this
      return new Promise(async function (resolve, reject) {
        try {
          const data = {
            md5,
            key: md5 + extension,
            filename: file.name,
            url: self.store.fileUrl(md5, extension, handler, 'screenshot/space')
          }
          const response = await postFile(data)
          const ret = await self.updateSpace(response.data.id)

          resolve(ret.data)
        } catch (err) {
          reject(err)
        }
      })
    },

    async loaded(info) {
      const self = this
      return new Promise(async function (resolve, reject) {
        try {
          console.error('~blob')
          const store = self.store

          console.error(self.prepare)
          if (self.prepare) {
            self.expire = false
            resolve()
          } else {
            console.error('blob')
            let blob = await self.screenshot()
            console.error(blob)
            blob.name = self.data.title
            blob.extension = '.jpg'
            const file = blob
            const md5 = await store.fileMD5(file)
            const handler = await store.publicHandler()
            const has = await store.fileHas(
              md5,
              file.extension,
              handler,
              'screenshot/space'
            )
            if (!has) {
              await store.fileUpload(
                md5,
                file.extension,
                file,
                p => {},
                handler,
                'screenshot/space'
              )
            }

            await self.saveFile(md5, file.extension, info, file, handler)
          }
        } catch (err) {
          reject(err)
        }

        resolve()
      })
    } /**/,

    screenshot() {
      return this.$refs.three.screenshot()
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: left;
      font-weight: bold;
      margin: 26px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
