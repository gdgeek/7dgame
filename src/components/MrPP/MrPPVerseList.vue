<template>
  <div>
    <waterfall :options="{}">
      <!-- slice Control number of items -->
      <waterfall-item
        v-for="(item, index) in items"
        :key="index"
        style="width: 330px"
      >
        <el-card style="width: 320px" class="box-card">
          <div slot="header">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <span slot="header" class="mrpp-title">
                <b class="card-title" nowrap>{{ item.name }}</b>
              </span>
              <router-link :to="'/verse/view?id=' + item.id">
                <img
                  v-if="item.image === null"
                  src="@/assets/image/none.png"
                  style="width: 100%; height: 270px; object-fit: contain"
                />
                <img
                  v-else
                  style="width: 100%; height: 270px"
                  fit="contain"
                  :src="item.image.url"
                  lazy
                />
              </router-link>
            </el-card>
            <Info-content :info="JSON.parse(item.info)" />
          </div>
          <div class="clearfix">
            <router-link slot="enter" :to="'/verse/view?id=' + item.id">
              <el-button type="primary" size="mini">进入</el-button>
            </router-link>
            <verse-toolbar
              :verse="item"
              @deleted="deleted"
              @changed="changed"
            />
          </div>
          <div class="bottom clearfix" />
        </el-card>
        <br />
      </waterfall-item>
    </waterfall>
  </div>
</template>

<script>
import { Waterfall, WaterfallItem } from 'vue2-waterfall'

import VerseToolbar from '@/components/VerseToolbar.vue'
import InfoContent from '@/components/InfoContent.vue'

export default {
  name: 'MrPPVerseList',
  components: {
    Waterfall,
    WaterfallItem,
    VerseToolbar,
    InfoContent
  },
  props: {
    items: {
      type: Array
    }
  },
  computed: {},
  methods: {
    refresh() {
      const self = this
      self.$emit('refresh')
    },

    changed: function (verse) {
      const self = this
      self.refresh()
    },

    deleted: function (verse) {
      const self = this
      self.refresh()
    },
    infoTable(item) {
      const table = []
      const info = JSON.parse(item.info)
      if (info !== null) {
        table.push({
          value: '内容说明：' + info.description
        })
      }
      return table
    }
  }
}
</script>
