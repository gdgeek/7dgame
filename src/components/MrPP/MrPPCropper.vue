<template>
  <div>
    <!-- <el-card class="box-card"> -->
    <el-upload
      class="file-uploader"
      action=""
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleChangeUpload"
      accept="image/jpeg,image/gif,image/png,image/bmp"
      style="float: left"
    >
      <img v-if="url" :src="url" class="file" />
      <i v-else class="el-icon-plus file-uploader-icon" />
    </el-upload>

    <!-- 用户基本信息 end-->
    <!-- vueCropper 剪裁图片dialog实现-->
    <el-dialog
      title="头像截取"
      :visible.sync="dialogVisible"
      class="crop-dialog"
      append-to-body
    >
      <div class="cropper-content">
        <div class="cropper" style="text-align: center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :output-size="option.size"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :fixed="option.fixed"
            :fixed-number="option.fixedNumber"
            :center-box="option.centerBox"
            :info-true="option.infoTrue"
            :fixed-box="option.fixedBox"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            @cropMoving="cropMoving"
          />
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button-group style="float: left">
          <!--   <el-button type="primary" plain @click="clearImgHandle">清除图片</el-button> -->
          <el-button size="mini" type="primary" plain @click="rotateLeftHandle">
            左旋转
          </el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            @click="rotateRightHandle"
          >
            右旋转
          </el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            @click="changeScaleHandle(1)"
          >
            放大
          </el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            @click="changeScaleHandle(-1)"
          >
            缩小
          </el-button>
        </el-button-group>
        <el-button-group>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="finish">
            确认
          </el-button>
        </el-button-group>
      </div>
    </el-dialog>
    <!-- vueCropper 剪裁图片dialog end-->
    <!-- </el-card> -->
  </div>
</template>

<script>
import { postFile } from '@/api/v1/files'

import { mapState } from 'vuex'
export default {
  name: 'MrPPCropper',
  props: {
    fileName: {
      type: String,
      require: true
    }
  },
  data: function () {
    return {
      url: null,
      isDisable: false,
      // isPreview: false,
      dialogVisible: false,
      // previewImg: '', // 预览图片地址
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'jpg', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        canMoveBox: true, // 截图框能否拖动
        autoCropWidth: 300, // 默认生成截图框宽度
        autoCropHeight: 300, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: false, // 是否输出原图比例的截图
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      // 防止重复提交
      loading: false
    }
  },
  computed: {
    ...mapState({
      store: state => state.config.store
    })
  },
  methods: {
    setImageUrl(url) {
      this.url = url
    },
    // 头像上传方法开始
    // 上传按钮 限制图片大小和类型
    handleChangeUpload(file, fileList) {
      const isJPG =
        file.raw.type === 'image/jpeg' ||
        file.raw.type === 'image/png' ||
        file.raw.type === 'image/bmp' ||
        file.raw.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG/BMP/GIF 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(async () => {
        // base64方式
        // this.option.img = await fileByBase64(file.raw)
        this.option.img = URL.createObjectURL(file.raw)
        this.loading = false
        this.dialogVisible = true
      })
    },
    // 放大/缩小
    changeScaleHandle(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 左旋转
    rotateLeftHandle() {
      this.$refs.cropper.rotateLeft()
    },
    // 右旋转
    rotateRightHandle() {
      this.$refs.cropper.rotateRight()
    },
    // 下载
    downloadHandle(type) {
      const aLink = document.createElement('a')
      aLink.download = 'author-img'
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob(data => {
          //   const downImg = window.URL.createObjectURL(data)
          aLink.href = window.URL.createObjectURL(data)
          aLink.click()
        })
      } else {
        this.$refs.cropper.getCropData(data => {
          //  const downImg = data
          aLink.href = data
          aLink.click()
        })
      }
    },
    // 清理图片
    clearImgHandle() {
      this.option.img = ''
    },
    // 截图框移动回调函数
    cropMoving(data) {
      // 截图框的左上角 x，y和右下角坐标x，y
      // let cropAxis = [data.axis.x1, data.axis.y1, data.axis.x2, data.axis.y2]
      // console.log(cropAxis)
    },
    async saveFile(md5, extension, file, handler) {
      const data = {
        filename: file.name,
        md5,
        key: md5 + extension,
        url: this.store.fileUrl(md5, extension, handler, 'backup')
      }
      this.url = data.url
      try {
        const response = await postFile(data)
        this.$emit('saveFile', response.data.id)
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async finish() {
      const self = this
      const store = this.store
      // 获取截图的 blob 数据
      this.$refs.cropper.getCropBlob(async blob => {
        blob.name = self.fileName
        blob.extension = '.jpg'
        const file = blob
        const md5 = await store.fileMD5(file)

        const handler = await store.publicHandler()
        const has = await store.fileHas(md5, file.extension, handler, 'backup')
        if (!has) {
          await store.fileUpload(
            md5,
            file.extension,
            file,
            p => {},
            handler,
            'backup'
          )
        }

        await self.saveFile(md5, file.extension, file, handler)

        this.dialogVisible = false
        this.loading = true
      })
    }
    // 头像传方法结束
  }
}
</script>

<style lang="scss" scoped>
.cropper-content {
  .cropper {
    width: auto;
    height: 350px;
  }
}

.file-uploader {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.file-uploader:hover {
  border-color: #409eff;
}
.file-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 132px;
  height: 132px;
  line-height: 132px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  margin-right: 12px;
  border-radius: 6px;
}
.file {
  width: 132px;
  height: 132px;
  display: block;
  border-radius: 6px;
  margin-right: 12px;
}
</style>
