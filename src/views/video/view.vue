<template>
  <div class="document-index">
    <el-row :gutter="20" style="margin: 28px 18px 0">
      <el-col :sm="16">
        <el-card class="box-card">
          <div slot="header">
            <b id="title">图片名称：</b>
            <span v-if="data">{{ data.name }}</span>
          </div>
          <div class="box-item" style="text-align: center">
            <video
              id="video"
              controls="controls"
              style="height: 300px; width: 100%"
            >
              <source v-if="file !== null" id="src" :src="file" />
            </video>
            <video
              id="new_video"
              style="height: 100%; width: 100%"
              hidden
              @canplaythrough="dealWith()"
            />
          </div>
        </el-card>
        <br />
      </el-col>

      <el-col :sm="8">
        <el-card class="box-card">
          <div slot="header">
            <b>视频信息</b>
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
import { getVideo, putVideo, deleteVideo } from '@/api/resources'

import { postFile } from '@/api/v1/files'
import { printVector2 } from '@/assets/js/helper'
import { mapState } from 'vuex'

export default {
  name: 'VideoView',
  data() {
    return {
      data: null,
      file: null,
      expire: true
    }
  },
  computed: {
    ...mapState({
      store: state => state.config.store
    }),
    tableData() {
      if (this.data !== null && this.prepare) {
        return [
          {
            item: '视频名称',
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
            item: '视频尺寸',
            text: printVector2(JSON.parse(this.data.info).size)
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
    }
  },
  created: async function () {
    const self = this
    self.expire = true
    const response = await getVideo(self.id)

    self.data = response.data
    self.file = response.data.file.url
    setTimeout(() => {
      self.init()
    }, 0)
  },
  methods: {
    thumbnail: function (video, width, height) {
      return new Promise((resolve, reject) => {
        const image_type = 'image/jpeg'
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        // 将所截图片绘制到canvas上，并转化成图片
        canvas
          .getContext('2d')
          .drawImage(video, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(function (blob) {
          resolve(blob)
        }, image_type)
      })
    },
    async save(md5, extension, info, file, handler) {
      const data = {
        md5,
        key: md5 + extension,
        filename: file.name,
        url: this.store.fileUrl(md5, extension, handler, 'screenshot/video')
      }
      try {
        const response1 = await postFile(data)

        const video = { image_id: response1.data.id, info }
        const response2 = await putVideo(this.data.id, video)

        this.data.image_id = response2.data.image_id
        this.data.info = response2.data.info
        this.expire = false
      } catch (e) {
        console.error(e)
      }
    },

    async setup(video, size) {
      const self = this
      const store = self.store
      if (size.x !== 0) {
        const info = JSON.stringify({ size })
        const blob = await self.thumbnail(video, size.x * 0.5, size.y * 0.5)
        blob.name = self.data.name + '.thumbnail'
        blob.extension = '.jpg'
        const file = blob
        const md5 = await store.fileMD5(file)
        const handler = await store.publicHandler()
        const has = await store.fileHas(
          md5,
          file.extension,
          handler,
          'screenshot/video'
        )
        if (!has) {
          await store.fileUpload(
            md5,
            file.extension,
            file,
            p => {},
            handler,
            'screenshot/video'
          )
        }

        await self.save(md5, file.extension, info, file, handler)
      }
    },
    init: function () {
      const video = document.getElementById('video')
      const source = document.getElementById('src')

      // 获取新的视频
      const new_video = document.getElementById('new_video')
      new_video.src = source.src + '?t=' + new Date()
      new_video.crossOrigin = 'anonymous'
      new_video.currentTime = 0.000001
      video.addEventListener(
        'timeupdate',
        function () {
          new_video.currentTime = video.currentTime
        },
        false
      )
    },
    dealWith: function () {
      if (!this.prepare) {
        const video = document.getElementById('video')
        // 获取新的视频
        const new_video = document.getElementById('new_video')
        const size = { x: video.videoWidth, y: video.videoHeight }
        this.setup(new_video, size)
      } else {
        this.expire = false
      }
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
      console.log(this.api + '/resources/' + id + '?type=video')
      try {
        await deleteVideo(id)

        this.$router.push({ path: '/video/index' })
      } catch (err) {
        console.error(err)
        this.failed(JSON.parse(err.message))
      }
    },
    namedWindow: function () {
      const self = this
      this.$prompt('请输入新名称', '修改图片名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputValue: self.data.name
      })
        .then(({ value }) => {
          self.named(self.data.id, value)
          this.$message({
            type: 'success',
            message: '新的图片名称: ' + value
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
      const video = { name }
      console.log(video)
      try {
        const response = await putVideo(id, video)
        this.data.name = response.data.name
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/view-style.scss';
</style>
