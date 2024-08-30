<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <b>
          <font-awesome-icon icon="edit" />
          我的创作
        </b>
        :
      </div>
      <div class="box-item">
        <el-descriptions
          v-if="creation"
          label-class-name="info-content-label"
          :column="2"
          :size="'mini'"
          border
        >
          <el-descriptions-item>
            <template slot="label">
              <router-link
                class="info-content-label-link"
                :to="'/polygen/index'"
              >
                <font-awesome-icon class="icon" icon="cube" />
                模型
              </router-link>
            </template>
            {{ creation.polygenCount }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <router-link
                class="info-content-label-link"
                :to="'/picture/index'"
              >
                <font-awesome-icon class="icon" icon="file-image" />
                图片
              </router-link>
            </template>
            {{ creation.pictureCount }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <router-link class="info-content-label-link" :to="'/video/index'">
                <font-awesome-icon class="icon" icon="file-video" />
                视频
              </router-link>
            </template>
            {{ creation.videoCount }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <router-link
                class="info-content-label-link"
                :to="'/meta-verse/index'"
              >
                <font-awesome-icon class="icon" icon="adjust" />
                宇宙
              </router-link>
            </template>
            {{ creation.verseCount }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <router-link
                class="info-content-label-link"
                :to="'/home/creator'"
              >
                <font-awesome-icon class="icon" icon="address-card" />
                发布
              </router-link>
            </template>
            {{ creation.postCount }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <router-link
                class="info-content-label-link"
                :to="'/home/creator'"
              >
                <font-awesome-icon class="icon" icon="fa-solid fa-thumbs-up" />
                点赞
              </router-link>
            </template>
            {{ creation.likeCount }}
          </el-descriptions-item>
        </el-descriptions>

        <aside style="margin-top: 10px; margin-bottom: 15px; float: right">
          <el-button type="primary" plain size="mini" @click="gotoCreator()">
            <i class="el-icon-edit" />
            进入
          </el-button>
        </aside>
      </div>
    </el-card>
    <br />
  </div>
</template>

<script>
import { getUserCreation } from '@/api/v1/user'
export default {
  name: 'MrPPUserCreater',
  data() {
    return {
      creation: null
    }
  },
  async created() {
    const self = this
    const r = await getUserCreation()
    self.creation = r.data
  },
  methods: {
    gotoCreator() {
      this.$router.push({ path: '/home/creator' })
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  width: 10px;
}
.el-col {
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #282a2b;
}
.info-title {
  height: 39px;
  font-weight: 700;
  color: #666666;
  line-height: 39px;
  border-bottom: 1px solid #e2e5ec;
}
.info-content-label {
  width: 70px;
}
.info-content-label-link:hover {
  color: #40a0ffd0;
  text-decoration: underline;
}
.info-content-label-link {
  color: #409eff;
}
</style>
