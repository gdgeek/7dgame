<template>
  <div>
    <div class="document-index">
      <el-card class="box-card-component" style="margin: 18px 18px 0">
        <div slot="header" class="box-card-header">
          <h3>{{ title }}:</h3>
          {{ declared }}
        </div>
        <div style="position: relative">
          <div v-for="item in data" :key="item.name">
            <div class="progress-item">
              <span>{{ item.title }}</span>
              <el-progress :percentage="item.percentage" />
            </div>
          </div>

          <el-divider />
          <el-button type="primary" :disabled="isdisabled" @click="select()">
            <slot>11</slot>
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { postFile } from '@/api/v1/files'

import { mapState } from 'vuex'

export default {
  name: 'MrPPUpload',
  props: {
    fileType: {
      type: String,
      default: '*'
    },
    dir: {
      type: String,
      default: null
    },
    advanced: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      store: state => state.config.store
    })
  },
  data: function () {
    const data = [
      {
        name: 'md5',
        title: '预先处理',
        failed: 'md5计算失败',
        declared: '通过计算得到文件的 md5 编码',
        percentage: 0,
        process: function ({ file }) {},
        status: ''
      },
      {
        name: 'upload',
        title: '上传文件',
        failed: '文件上传失败',
        declared: '文件正在发送至服务器',
        percentage: 0,
        status: ''
      },
      {
        name: 'save',
        title: '保存信息',
        failed: '数据库储存失败',
        declared: '文件数据存储在数据库中',
        percentage: 0,
        status: ''
      }
    ]
    return {
      data,
      title: '选择文件',
      declared: '请选择对应格式的文件进行上传操作',
      isdisabled: false
    }
  },

  methods: {
    step(idx) {
      const item = this.data[idx]
      this.title = item.title
      this.declared = item.declared
    },
    progress(p, idx) {
      this.step(idx)
      if (p >= 1) {
        this.data[idx].status = 'success'
      } else {
        this.data[idx].status = ''
      }

      this.data[idx].percentage = Math.round(Math.min(p, 1) * 100)
    },

    async saveFile(md5, extension, file, handler) {
      const self = this

      return new Promise(async function (resolve, reject) {
        try {
          const data = {
            filename: file.name,
            md5,
            key: md5 + extension,
            url: self.store.fileUrl(md5, extension, handler, self.dir)
          }

          self.progress(1, 1)

          const response = await postFile(data)
          self.$emit('saveResource', data.filename, response.data.id, () => {
            self.progress(2, 1)
          })

          resolve()
        } catch (err) {
          reject(err)
        }
      })
    },

    async select() {
      const self = this
      const store = self.store
      const file = await store.fileOpen(self.fileType)
      self.isdisabled = !self.isdisabled
      const md5 = await store.fileMD5(file, function (p) {
        self.progress(p, 0)
      })
      const handler = await store.publicHandler()
      const has = await store.fileHas(md5, file.extension, handler, self.dir)

      if (!has) {
        await store.fileUpload(
          md5,
          file.extension,
          file,
          function (p) {
            self.progress(p, 1)
          },
          handler,
          self.dir
        )
      }

      await self.saveFile(md5, file.extension, file, handler)
    }
  }
}
</script>

<style scoped></style>
