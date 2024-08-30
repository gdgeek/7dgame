<template>
  <div class="background">
    <el-dialog
      :visible.sync="dialogVisible"
      :width="width + '%'"
      :before-close="handleClose"
      :title="video ? video.title : ''"
    >
      <el-card class="box-card" style="text-align: center">
        <video-player
          ref="videoPlayer"
          class="video-player-box"
          :options="playerOptions"
          :playsinline="true"
          custom-event-name="customstatechangedeventname"
          @play="onPlayerPlay($event)"
        />
      </el-card>
    </el-dialog>

    <el-card class="box-card">
      <div
        v-if="$route.path.includes('web/example')"
        align="center"
        style="padding: 30px 0"
      >
        <h2 style="color: #666666">元宇宙实景赋能用户创造内容</h2>
        <h1 style="margin: 50px 0">精彩案例</h1>
        <p style="color: #666666">
          基于iPad实现的第三人称视角，多设备无延时互动，多人联机，真实场景物理模拟
        </p>
      </div>
      <div v-else slot="header" class="clearfix">
        <b>相关案例</b>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          class="font-text"
        >
          <a target="_blank" href="https://space.bilibili.com/20959246">
            更多内容
          </a>
        </el-button>
      </div>
      <el-row :gutter="20">
        <el-col
          v-for="(item, index) in items"
          :key="index"
          :xs="24"
          :sm="12"
          :md="6"
          :lg="6"
          :xl="6"
        >
          <el-card shadow="hover" :body-style="{ padding: '0px' }">
            <div>
              <img
                :src="item.image"
                class="image"
                style="width: 100%; position: relative; z-index: 0"
                @click="onSelected(item)"
              />
            </div>
            <div style="padding: 14px">
              <div style="height: 60px">
                <span class="font-text">{{ item.title }}</span>
                <div class="bottom clearfix">
                  <time class="time font-text">{{ item.describe }}</time>
                  <br />
                </div>
              </div>
              <el-button
                type="text"
                class="button font-text"
                @click="onSelected(item)"
              >
                播放视频
              </el-button>
              <br />
            </div>
          </el-card>
          <br />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import '@/assets/font/font.css'
import 'video.js/dist/video-js.css'
import IsMobile from '@/layout/site/mixin/IsMobile'
import { data } from '@/views/web/data/examples.js'
import { videoPlayer } from 'vue-video-player'

import '@/assets/font/font.css'
export default {
  name: 'Cards',
  components: {
    videoPlayer
  },

  mixins: [IsMobile],
  data() {
    return {
      video: null,
      width: 65,
      playerOptions: {
        width: 400,
        muted: true,
        language: 'en',
        autoplay: true,
        fullscreen: { options: { navigationUI: 'hide' } },
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: 'video/mp4',
            src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
          }
        ],
        poster: 'http://localhost:9528/media/image/logo.gif'
      }
    }
  },
  computed: {
    isFullScreen() {
      if (document.fullscreen) {
        return true
      } else if (document.mozFullScreen) {
        return true
      } else if (document.webkitIsFullScreen) {
        return true
      } else if (document.msFullscreenElement) {
        return true
      } else if (window.fullScreen) {
        return true
      }
      return false
    },
    items() {
      return data
    },
    dialogVisible() {
      return this.video !== null
    },
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  mounted() {
    const self = this
    self.onresize()
    window.addEventListener('resize', self.onresize, false)
  },
  destroyed() {
    window.removeEventListener('resize', self.onresize)
  },
  methods: {
    goto(path) {
      this.$router.push(path)
    },
    onPlayerPlay(player) {
      if (this.$_isXS()) {
        player.requestFullscreen()
      }
    },
    onresize() {
      this.playerOptions.width = window.innerWidth * (this.width / 100) - 80
    },
    handleClose() {
      this.video = null
    },
    onSelected(item) {
      if (this.$_isSM()) {
        this.width = 100
      } else if (this.$_isMD()) {
        this.width = 80
      } else if (this.$_isXL()) {
        this.width = 65
      }
      this.onresize()

      this.playerOptions.sources[0].src = item.url
      this.playerOptions.poster = item.image
      this.video = { title: item.title }
    }
  }
}
</script>

<style lang="scss" scoped>
.background {
  padding: 20px;
}
.image {
  cursor: pointer;
}
.time {
  font-size: 13px;
  color: #999;
}
.text {
  font-family: 'SourceHanSansHWSC-VF';
}
.title {
  font-family: 'SmileySans-Oblique';
}

.parent {
  position: absolute;
  z-index: 3;
  margin: 0px;
  opacity: 0.5;
}
.button {
  padding: 0;
  float: right;
}
</style>
