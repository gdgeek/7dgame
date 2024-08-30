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
            <el-image
              id="image"
              v-loading="expire"
              element-loading-text="正在预处理"
              element-loading-background="rgba(255,255, 255, 0.3)"
              style="height: 300px; width: 100%"
              :src="picture"
              fit="contain"
              @load="dealWith()"
            />
          </div>
        </el-card>
        <br />
      </el-col>

      <el-col :sm="8">
        <el-card class="box-card">
          <div slot="header">
            <b>图片信息</b>
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
import { getPicture, putPicture, deletePicture } from '@/api/resources'

import { isHttps,  convertToHttps} from '@/assets/js/helper'
import { postFile } from '@/api/v1/files'
import { printVector2 } from '@/assets/js/helper'

import { mapState } from 'vuex'
export default {
  name: 'PictureView',
  data: function () {
    return {
      data: null,
      file: null,
      expire: false
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
            item: '图片名称',
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
            item: '图片尺寸',
            text: printVector2(JSON.parse(this.data.info).size)
          },
          {
            item: '文件大小',
            text: this.data.file.size + '字节'
          }
        ]
      } else {
        return []
      }
    },
    picture() { 
      return convertToHttps(this.file)
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
    try {
      self.expire = true
      const response = await getPicture(self.id)
      self.data = response.data
      self.file = response.data.file.url
    } catch (err) {
      alert(err)
    }
  },
  methods: {
    getImageSize: function (imageEl) {
      return new Promise((resolve, reject) => {
        const img = new Image() // 新建一个图片对象
        img.src = imageEl.src
        if (img.width === 0) {
          img.onload = function () {
            resolve({ x: img.width, y: img.height })
          }
        } else {
          resolve({ x: img.width, y: img.height })
        }
      })
    },
    thumbnail: function (image, width, height) {
      return new Promise((resolve, reject) => {
        const image_type = 'image/jpeg'
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(image, 0, 0, width, height)
        canvas.toBlob(function (blob) {
          resolve(blob)
        }, image_type)
      })
    },
    async save(md5, extension, info, file, handler) {
      const self = this
      const data = {
        md5,
        key: md5 + extension,
        filename: file.name,
        url: self.store.fileUrl(md5, extension, handler, 'screenshot/picture')
      }
      try {
        const response1 = await postFile(data)
        const picture = { image_id: response1.data.id, info }
        const response2 = await putPicture(self.data.id, picture)

        self.data.image_id = response2.data.image_id
        self.data.info = response2.data.info
        self.expire = false
      } catch (e) {
        console.error(e)
      }
    },

    async setup(size, image) {
      const self = this
      const store = this.store

      const info = JSON.stringify({ size })
      if (size.x <= 1024) {
        const picture = { image_id: self.data.file.id, info }
        putPicture(self.data.id, picture).then(response => {
          self.data.image_id = response.data.image_id
          self.data.info = response.data.info
          self.expire = false
        })
        return
      }
      const blob = await self.thumbnail(image, 512, size.y * (512 / size.x))

      blob.name = self.data.name + '.thumbnail'
      blob.extension = '.jpg'
      const file = blob

      const md5 = await store.fileMD5(file)
      const handler = await store.publicHandler()
      const has = await store.fileHas(
        md5,
        file.extension,
        handler,
        'screenshot/picture'
      )
      if (!has) {
        await store.fileUpload(
          md5,
          file.extension,
          file,
          p => {},
          handler,
          'screenshot/picture'
        )
      }
      await self.save(md5, file.extension, info, file, handler)
    },
    dealWith: async function () {
      const self = this
      if (!self.prepare) {
        const image = document.getElementById('image')
        image.crossOrigin = 'anonymous'
        if (image.complete) {
          const size = await self.getImageSize(image)
          console.log(size)

          self.setup(size, image)
        }
      } else {
        self.expire = false
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
      console.log(this.api + '/resources/' + id + '?type=picture')

      try {
        await deletePicture(id)
        this.$router.push({ path: '/picture/index' })
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
      const picture = { name }
      console.log(picture)
      try {
        const response = await putPicture(id, picture)
        this.data.name = response.data.name
      } catch (err) {
        console.error(err)
      }
      console.log(picture)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/view-style.scss';
</style>
