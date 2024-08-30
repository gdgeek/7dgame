<template>
  <div>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <div class="box-title">
            <h3 class="font-color">个人资料</h3>
            <small>用户昵称、头像、基本信息修改</small>
          </div>
        </el-col>
        <el-col align="right">
          <span>
            <router-link to="/home/index">
              <el-button size="small">返回个人中心</el-button>
            </router-link>
          </span>
        </el-col>
      </el-row>
      <el-divider />
      <div class="box-title box-margin-bottom">
        <h3 class="font-color">用户昵称</h3>
        <small>让MrPP社区的其它用户更容易认识您。</small>
      </div>
      <!-- 用户头像和昵称开始 -->
      <el-row :gutter="24">
        <el-col
          :xs="23"
          :sm="16"
          :md="14"
          :lg="12"
          :xl="10"
          class="section-margin-left"
        >
          <el-form
            ref="nicknameForm"
            :model="nicknameForm"
            :rules="nicknameRules"
            label-width="80px"
          >
            <el-form-item
              label="昵称"
              prop="nickname"
              style="margin-bottom: 26px"
            >
              <el-input
                v-model="nicknameForm.nickname"
                style="width: 100%"
                placeholder="昵称"
                autocomplete="off"
                @keyup.enter.native="submitNickname"
              >
                <el-button
                  slot="suffix"
                  style="margin-right: -5px"
                  :disabled="isDisable"
                  @click="submitNickname"
                >
                  确定
                </el-button>
              </el-input>
            </el-form-item>
            <!-- 头像部分 -->
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleChangeUpload"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                style="float: left"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <div style="float: left">
                <p class="user-explain">最大尺寸 2 MB。JPG、GIF、PNG。</p>
              </div>
            </el-form-item>

            <!-- 头像部分 end -->
          </el-form>
        </el-col>
      </el-row>
      <!-- 用户头像和昵称 end -->
      <el-divider />
      <div class="box-title box-margin-bottom">
        <h3 class="font-color">基本信息</h3>
        <small style="line-height: 16px">
          请填写你的基本信息，以获得更有乐趣的个性化交互和体验。
        </small>
      </div>

      <!-- 用户基本信息 star-->
      <el-row :gutter="24">
        <el-col
          :xs="23"
          :sm="16"
          :md="14"
          :lg="12"
          :xl="10"
          class="section-margin-left box-margin-bottom"
        >
          <el-form
            ref="infoForm"
            :model="infoForm"
            :rules="infoRules"
            label-width="80px"
          >
            <el-form-item label="性别">
              <el-radio-group v-model="infoForm.sex">
                <el-radio-button label="man">
                  <i class="el-icon-male el-icon--left" />
                  男
                </el-radio-button>
                <el-radio-button label="woman">
                  <i class="el-icon-female el-icon--left" />
                  女
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="行业" prop="industry">
              <el-select
                v-model="infoForm.industry"
                style="width: 100%"
                placeholder="请选择活动区域"
              >
                <el-option label="科技、信息技术" value="科技、信息技术" />
                <el-option label="经济、金融" value="经济、金融" />
                <el-option label="教育、医疗" value="教育医疗" />
                <el-option label="能源、制造业" value="能源、制造业" />
                <el-option label="农、林、渔、牧" value="农、林、渔、牧" />
                <el-option label="服务业" value="服务业" />
                <el-option label="其它行业" value="其它行业" />
              </el-select>
            </el-form-item>
            <el-form-item label="居住地" prop="selectedOptions">
              <el-cascader
                v-model="infoForm.selectedOptions"
                size="large"
                :options="addressOptions"
                style="width: 100%"
                @change="handleChange"
              />
            </el-form-item>
            <el-form-item label="个人简介" prop="textarea">
              <el-input
                v-model="infoForm.textarea"
                style="width: 100%"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 10 }"
                placeholder="个人信息的简要介绍"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="width: 150px"
                :disabled="isDisable"
                @click="saveInfo()"
              >
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
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
        <!-- <div class="action-box">
          <el-upload
            class="upload-demo"
            action=""
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleChangeUpload"
          >
            <el-button type="primary" plain>更换图片</el-button>
          </el-upload>
        </div> -->
        <div slot="footer" class="dialog-footer">
          <el-button-group style="float: left">
            <!--   <el-button type="primary" plain @click="clearImgHandle">清除图片</el-button> -->
            <el-button
              size="mini"
              type="primary"
              plain
              @click="rotateLeftHandle"
            >
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
            <el-button size="mini" @click="dialogVisible = false">
              取 消
            </el-button>
            <el-button
              size="mini"
              type="primary"
              :loading="loading"
              @click="finish"
            >
              确认
            </el-button>
          </el-button-group>
        </div>
      </el-dialog>
      <!-- vueCropper 剪裁图片dialog end-->
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { putUserData } from '@/api/v1/user'
import { regionDataPlus, CodeToText } from 'element-china-area-data'

import { postFile } from '@/api/v1/files'

import { mapState } from 'vuex'

export default {
  name: 'Edit',
  computed: {
    ...mapState({
      store: state => state.config.store
    }),
    ...mapGetters(['userData']),
    imageUrl() {
      if (typeof this.userData.avatar === 'undefined') {
        return null
      }
      return this.userData.avatar.url
    }
  },
  data: function () {
    const validateNickname = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户昵称 '))
      } else if (value === this.userData.nickname) {
        callback(new Error('新用户名不能和旧用户名一致!'))
      } else {
        callback()
      }
    }
    return {
      isDisable: false,
      nicknameForm: {
        nickname: ''
      },
      nicknameRules: {
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, message: '昵称长度应该大于2', trigger: 'blur' },
          { validator: validateNickname, trigger: 'blur' }
        ]
      },
      addressOptions: regionDataPlus,
      infoForm: {
        sex: 'man',
        industry: '',
        selectedOptions: [],
        textarea: ''
      },
      infoRules: {
        industry: [
          { required: true, message: '请输入所在行业', trigger: 'blur' },
          { min: 2, message: '行业长度应该大于2', trigger: 'blur' }
        ],
        textarea: [
          { required: true, message: '请输入个人简介', trigger: 'blur' },
          { max: 60, message: '个人简介不能超过60字', trigger: 'blur' }
        ]
      },
      // 剪裁组件配置开始
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
  created() {
    const self = this
    self.nicknameForm.nickname = self.userData.nickname
    const info = JSON.parse(self.userData.info)

    if (info !== null) {
      if (typeof info.sex !== 'undefined') {
        self.infoForm.sex = info.sex
      }

      if (typeof info.industry !== 'undefined') {
        self.infoForm.industry = info.industry
      }
      if (typeof info.textarea !== 'undefined') {
        self.infoForm.textarea = info.textarea
      }

      if (typeof info.selectedOptions !== 'undefined') {
        self.infoForm.selectedOptions = info.selectedOptions
      }
    }
  },
  methods: {
    handleChange(value) {
      var ctt =
        CodeToText[value[0]] + CodeToText[value[1]] + CodeToText[value[2]]
      console.log(ctt)
    },
    submitNickname() {
      const self = this
      self.isDisable = true
      setTimeout(() => {
        this.isDisable = false // 防重复提交，两秒后才能再次点击
      }, 2000)
      this.$refs.nicknameForm.validate(valid => {
        if (valid) {
          putUserData({ nickname: self.nicknameForm.nickname }).then(
            response => {
              self.refreshUserdata(response.data)
              this.$message({
                message: '修改昵称成功',
                type: 'success'
              })
            }
          )
        }
      })
    },
    refreshUserdata(data) {
      console.log(data)
      this.$store.commit('user/setUser', data)
    },
    saveInfo() {
      const self = this
      self.isDisable = true
      setTimeout(() => {
        this.isDisable = false // 防重复提交，两秒后才能再次点击
      }, 2000)
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          putUserData({ info: JSON.stringify(self.infoForm) }).then(
            response => {
              console.log(response.data)
              self.refreshUserdata(response.data)
              this.$message({
                message: '修改信息成功',
                type: 'success'
              })
            }
          )
        }
      })
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
        this.$refs.cropper.getCropBlob(async data => {
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
    async saveAvatar(md5, extension, file, handler) {
      const data = {
        md5,
        key: md5 + extension,
        filename: file.name,
        url: this.store.fileUrl(md5, extension, handler, 'backup')
      }
      try {
        const post = await postFile(data)
        const put = await putUserData({ avatar_id: post.data.id })
        this.refreshUserdata(put.data)
        this.$message({
          message: '修改头像成功',
          type: 'success'
        })
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
        blob.name = self.userData.username + '.avatar'

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
        await self.saveAvatar(md5, file.extension, file, handler)

        this.dialogVisible = false
        this.loading = true
      })
    }
    // 头像上传方法结束
  }
}
</script>

<style lang="scss" scoped>
@media screen and (min-width: 900px) {
  .section-margin-left {
    margin-left: 12%;
  }
}
.box-card {
  margin: 1.6% 1.6% 0.6%;
}
.box-title {
  line-height: 10px;
  padding: 2px 0;
  margin-left: 1%;
  color: #4d4f52;
}
.box-margin-bottom {
  margin-bottom: 28px;
}
.font-color {
  font-weight: 500;
}
.user-explain {
  font-size: 12px;
  line-height: 20px;
}
.cropper-content {
  .cropper {
    width: auto;
    height: 350px;
  }
}

.avatar-uploader {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
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
.avatar {
  width: 132px;
  height: 132px;
  display: block;
  border-radius: 6px;
  margin-right: 12px;
}
</style>
