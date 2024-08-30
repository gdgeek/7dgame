<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>相关场景:</span>
        <b v-if="verse">{{ verse.name }}</b>
      </div>
      <img v-if="verse" :src="verse.image.url" class="image" />
      <div style="padding: 0px">
        <info-content v-if="verse" :info="JSON.parse(verse.info)" />
        <br />

        <router-link v-if="verse" :to="'/verse/view?id=' + verse.id">
          <el-button style="width: 100%" type="primary" size="mini">
            打开场景
          </el-button>
        </router-link>
      </div>
    </el-card>
    <br />
  </div>
</template>

<script>
import InfoContent from '@/components/InfoContent.vue'
import { getVerse } from '@/api/v1/verse'
export default {
  name: 'InfoCard',
  components: {
    InfoContent
  },
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      verse: null
    }
  },
  created() {
    const self = this
    getVerse(self.info.target.id, 'image').then(res => {
      self.verse = res.data
    })
  }
}
</script>

<style lang="scss" scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
</style>
