<template>
  <div class="verse-code">
    <el-container>
      <el-main>
        <el-card v-loading="loading" class="box-card">
          <div slot="header" class="clearfix">
            <router-link
              v-if="meta"
              :to="
                '/meta/rete-meta?id=' +
                meta.id +
                '&title=' +
                encodeURIComponent(title)
              "
            >
              <el-link v-if="meta" :underline="false">
                【元：{{ title }}】
              </el-link>
            </router-link>
            / 【script】

            <el-button-group style="float: right">
              <el-button
                v-if="saveable"
                type="primary"
                size="mini"
                @click="save()"
              >
                <font-awesome-icon icon="save" />
                保存
              </el-button>
            </el-button-group>
          </div>

          <coding
            v-if="meta !== null"
            :meta="meta"
            ref="blockly"
            :cyber="cyber"
            :id="id"
            :index="meta.uuid"
          />
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Coding from '@/components/Coding.vue'

import { mapMutations } from 'vuex'
import { getMeta } from '@/api/v1/meta'
import { postCyber } from '@/api/v1/cyber'
import { AbilityEditable } from '@/ability/ability'
var qs = require('querystringify')
var path = require('path')
export default {
  name: 'Cyber',
  components: {
    Coding
  },
  data() {
    return {
      loading: false,
      meta: null,
      cyber: null
    }
  },
  computed: {
    id() {
      return parseInt(this.$route.query.id)
    },
    title() {
      return this.$route.query.title
    },
    saveable() {
      if (this.meta === null) {
        return false
      }

      return this.$can('editable', new AbilityEditable(this.meta.editable))
    }
  },
  destroyed() {
    this.setBreadcrumbs({ list: [] })
  },
  async created() {
    const self = this
    this.setBreadcrumbs({
      list: [
        {
          path: '/',
          meta: { title: '元宇宙实景编程平台' }
        },
        {
          path: '/meta-verse/index',
          meta: { title: '宇宙' }
        },
        {
          path: '.',
          meta: { title: '赛博编辑' }
        }
      ]
    })

    const response = await getMeta(this.id, 'cyber,event,share')
    self.meta = response.data
    this.setBreadcrumbs({
      list: [
        {
          path: '/',
          meta: { title: '元宇宙实景编程平台' }
        },
        {
          path: '/meta-verse/index',
          meta: { title: '宇宙' }
        },
        {
          path: '/verse/view?id=' + self.meta.verse_id,
          meta: { title: '【宇宙】' }
        },
        {
          path: '/verse/scene?id=' + self.meta.verse_id,
          meta: { title: '宇宙编辑' }
        },
        {
          path:
            '/meta/rete-meta?id=' +
            self.meta.id +
            '&title=' +
            encodeURIComponent(self.title),
          meta: { title: '元编辑' }
        },
        {
          path: '.',
          meta: { title: '赛博' }
        }
      ]
    })
    if (self.meta.cyber === null) {
      if (this.saveable) {
        const response = await postCyber({ meta_id: self.meta.id })
        self.cyber = response.data
      }
    } else {
      self.cyber = self.meta.cyber
    }
  },

  beforeDestroy() {
    if (this.saveable) {
      this.save()
    }
  },
  methods: {
    ...mapMutations('breadcrumb', ['setBreadcrumbs']),
    save() {
      this.$refs.blockly.save()
    }
  }
}
</script>
