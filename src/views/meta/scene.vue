<template>
  <div class="verse-scene">
    <resource-dialog
      @selected="selectResources"
      @cancel="cancel()"
      ref="dialog"
    />
    <el-container>
      <el-main>
        <iframe
          id="editor"
          :src="src"
          class="content"
          height="100%"
          width="100%"
        />
      </el-main>
    </el-container>
  </div>
</template>

<script>
var qs = require('querystringify')
var path = require('path')

import ResourceDialog from '@/components/MrPP/ResourceDialog.vue'
import { AbilityEditable } from '@/ability/ability'
import { mapMutations } from 'vuex'
import env from '@/environment.js'
import { putMeta } from '@/api/v1/meta'
import { getMeta } from '@/api/v1/meta'

export default {

  components: {
    ResourceDialog
  },
  name: 'VerseScene',
  data() {
    const src = path.join('three.js/editor', 'meta-editor.html')

    return {
      isInit: false,
    //  meta: null,
      src
    }
  },
  computed: {
    id() {
      return parseInt(this.$route.query.id)
    },

    title() {
      return this.$route.query.title
    },

  
  },
  destroyed() {
    this.setBreadcrumbs({ list: [] })
  },
  created() {
    window.addEventListener('message', this.handleMessage)
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
          meta: { title: '场景编辑' }
        }
      ]
    })
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleMessage)
  },
  methods: {
    cancel() {
     
    },
    selectResources(data) {
    //  alert(123)
      console.error(data)
      this.postMessage({
                action: 'load_resource',
                data: data
              })
    },
    saveable(data) {
      if (data === null) {
        return false
      }
      return this.$can('editable', new AbilityEditable(data.editable))
    },
    loadResource(data) {
      
      this.$refs.dialog.open(null, this.id, data.type)
     
    },
    postMessage(data) { 
      data.verify = 'mrpp.com';
      const iframe = document.getElementById('editor')
      iframe.contentWindow.postMessage(data, '*')
    },
    async handleMessage(e) {
      const self = this
      const data = e.data
      if (e.data.from === 'mrpp-editor') {
        switch (e.data.action) {
          case 'save':
            self.saveMeta(data)
            break
          case 'load_resource':
            this.loadResource(e.data.data)
            break
          case 'goto':
            if (e.data.data == 'blockly.js') { 
              
              this.$router.push({ path: '/meta/script', query: { id:this.id, title:this.title } })

            }else if (e.data.data == 'rete.js') {
              this.$router.push({ path: '/meta/rete-meta', query: { id:this.id, title:this.title } })
            }
            break;
          case 'ready':
            if (self.isInit == false) {
              self.isInit = true
              const meta = await getMeta(this.id)
              self.breadcrumb(meta.data)
              self.postMessage({
                action: 'load',
                data: meta.data,
                saveable: this.saveable(meta.data)
              })
            }
            break
        }
      }
    },
    ...mapMutations('breadcrumb', ['setBreadcrumbs']),
    breadcrumb(meta) {
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
            path: '/verse/view?id=' + meta.verse_id,
            meta: { title: '【宇宙】' }
          },
          {
            path: '/verse/scene?id=' + meta.verse_id,
            meta: { title: '宇宙编辑' }
          },
          {
            path:
              '/meta/rete-meta?id=' +
              meta.id +
              '&title=' +
              encodeURIComponent(this.title),
            meta: { title: '元编辑' }
          },
          {
            path: '.',
            meta: { title: '内容编辑' }
          }
        ]
      })
    },
    async saveMeta({ data, events }) {
      if (!this.saveable) {
        this.$message({
          type: 'info',
          message: '没有保存权限!'
        })
        return
      }
      await putMeta(this.id, { data, events })
      this.$message({
        type: 'success',
        message: '保存成功!'
      })
  
              
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: calc(100vh - 140px);
  border-style: solid;
  border-width: 1px;
}
</style>
