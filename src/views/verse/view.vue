<template>
  <div class="verse-view">
    <el-dialog :title="'修改信息'" :visible.sync="dialog" width="70%">
      <mr-p-p-message-from ref="editor" :data="briefing" @post="postMessage" />
    </el-dialog>
    <el-row :gutter="20" style="margin: 28px 18px 0">
      <el-col :sm="16">
        <el-card v-if="verse" class="box-card">
          <div slot="header">
            <i class="el-icon-edit" v-if="saveable"></i>
            <i class="el-icon-view" v-else></i>
            <b id="title">【宇宙】名称：</b>
            <span>{{ verse.name }}</span>
          </div>

          <div class="box-item">
            <el-image
              v-if="verse.image === null"
              fit="contain"
              style="width: 100%; height: 300px"
            />
            <el-image
              v-else
              fit="contain"
              style="width: 100%; height: 300px"
              :src="verse.image.url"
            />
          </div>
        </el-card>
        <br />

        <el-card v-if="verse !== null" class="box-card">
          <el-button
            style="width: 100%"
            type="primary"
            size="mini"
            @click="comeIn()"
          >
            <div v-if="saveable">
              <font-awesome-icon icon="edit" />
              &nbsp;编辑【宇宙】
            </div>
            <div v-else>
              <font-awesome-icon icon="eye" />
              &nbsp;查看【宇宙】
            </div>
          </el-button>
          <br />
        </el-card>

        <message
          v-if="message !== null"
          ref="message"
          :message_id="message.id"
          @setMessage="setMessage"
        />
        <reply v-if="message !== null" :message_id="message.id" />
      </el-col>

      <el-col :sm="8">
        <el-card class="box-card">
          <div slot="header">
            <b>【宇宙】信息</b>
          </div>
          <div class="box-item">
            <info-content v-if="verse" :info="JSON.parse(verse.info)" />

            <aside style="margin-top: 10px; margin-bottom: 30px">
              <el-button-group style="float: right" />
            </aside>
          </div>
          <verse-toolbar :verse="verse" @deleted="deleted" @changed="changed" />

          <br />
        </el-card>

        <br />
        <el-card v-if="$can('root')">
          <el-button
            v-if="verseOpen === null"
            style="width: 100%"
            type="primary"
            size="mini"
            @click="open()"
          >
            <font-awesome-icon icon="eye" />
            &nbsp;开放【宇宙】
          </el-button>

          <el-button
            v-else
            style="width: 100%"
            type="primary"
            size="mini"
            @click="close()"
          >
            <font-awesome-icon icon="eye-slash" />
            &nbsp;关闭【宇宙】
          </el-button>
        </el-card>
        <share v-if="saveable" :verse="verse" />

        <br />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import MrPPMessageFrom from '@/components/MrPP/MrPPMessageFrom.vue'
import { getVerse } from '@/api/v1/verse'

import Reply from '@/components/Reply'
import InfoContent from '@/components/InfoContent.vue'
import Message from '@/components/Message.vue'
import Share from '@/components/Share.vue'

import { AbilityWorks } from '@/ability/ability'
import VerseToolbar from '@/components/VerseToolbar.vue'
import { postMessage } from '@/api/v1/message'
import { postVerseOpen, deleteVerseOpen } from '@/api/v1/verse-open'
export default {
  name: 'VerseView',
  data() {
    return {
      verse: null,
      dialog: false,
      briefing: { title: 'sdfsdf', body: 'eee' }
    }
  },

  computed: {
    ...mapState({
      tagsMap: state => state.tags.tagsMap
    }),
    saveable() {
      if (this.verse === null) {
        return false
      }

      return this.$can('update', new AbilityWorks(this.verse.author_id))
    },
    id() {
      return parseInt(this.$route.query.id)
    },
    message() {
      if (this.verse === null) {
        return null
      }
      return this.verse.message
    },
    verseOpen() {
      if (this.verse === null) {
        return null
      }
      return this.verse.verseOpen
    },
    info() {
      if (this.verse === null || this.verse.info === null) {
        return null
      }
      return JSON.parse(this.verse.info)
    }
  },
  components: {
    MrPPMessageFrom,
    Message,
    VerseToolbar,
    InfoContent,
    Reply,
    Share
  },

  destroyed() {
    this.setBreadcrumbs({ list: [] })
  },
  created: function () {
    const self = this
    this.refresh()
    if (self.tagsMap == null) {
      self.refreshTags()
    }

    this.setBreadcrumbs({
      list: [
        {
          path: '/',
          meta: { title: '元宇宙实景编程平台' }
        },

        {
          path: '/meta-verse',
          meta: { title: '宇宙' }
        },
        {
          path: '.',
          meta: { title: '【宇宙】' }
        }
      ]
    })
  },
  methods: {
    ...mapMutations('breadcrumb', ['setBreadcrumbs']),
    ...mapActions('tags', {
      refreshTags: 'refreshTags'
    }),
    async refresh() {
      const self = this
      const res = await getVerse(
        self.id,
        'image,verseOpen,verseShare,author, message'
      )
      this.verse = res.data
      if (this.message !== null) {
        this.briefing = this.message
      } else {
        this.briefing = {
          title: '【宇宙】名称：' + this.verse.name,
          body: this.info.description
        }
      }
    },
    deleted: function (verse) {
      const self = this
      self.$router.push({ path: '/meta-verse/index' })
    },
    changed: function (verse) {
      const self = this
      self.refresh()
    },
    setMessage(message) {
      const self = this
      self.verse.message = message
    },
    postMessage: function (data) {
      const self = this
      const info = { target: { type: 'verse', id: self.id } }
      data.info = JSON.stringify(info)
      postMessage(data).then(response => {
        self.verse.message = response.data
        postVerseOpen({ verse_id: this.id, message_id: self.message.id }).then(
          res => {
            self.verse.verseOpen = res.data
            self.dialog = false
            this.$message({
              message: '分享成功',
              type: 'success'
            })
          }
        )
      })
    },
    close() {
      const self = this
      deleteVerseOpen(self.verseOpen.id).then(res => {
        self.verse.verseOpen = null
        self.verse.message = null
        this.$message({
          message: '停止共享',
          type: 'success'
        })
      })
    },

    open() {
      const self = this
      self.dialog = true
    },
    comeIn() {
      const self = this
      self.$router.push({ path: '/verse/scene', query: { id: self.id } })
    }
  }
}
</script>
