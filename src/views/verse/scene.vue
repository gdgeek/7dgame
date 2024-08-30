<template>

  <div class="verse-scene">

    <knight-data-dialog ref="knightData"  />
    <meta-dialog
      @selected="selected"
      @cancel="cancel"
      ref="metaDialog"
    />

    <prefab-dialog
      @selected="selected"
      @cancel="cancel"
      ref="prefabDialog"
    />
    <el-container>
      <el-main>
        <iframe
          id="editor"
          :src="editor_url"
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
import PrefabDialog from '@/components/MrPP/PrefabDialog.vue'
import MetaDialog from '@/components/MrPP/MetaDialog.vue'
import KnightDataDialog from '@/components/MrPP/KnightDataDialog.vue'

import { AbilityEditable } from '@/ability/ability'
import { mapMutations } from 'vuex'
import { putVerse } from '@/api/v1/verse'
import { getPrefab } from '@/api/v1/prefab'
import { getMeta } from '@/api/v1/meta'
import { getVerse } from '@/api/v1/verse'
export default {
  name: 'VerseScene',
  components: {
    KnightDataDialog,
    PrefabDialog,
    MetaDialog
  },
  data() {
   

    return {
      init: false,
      saveable: null,
     // src
    }
  },
  computed: {
    id() {
      return parseInt(this.$route.query.id)
    },
    editor_url() {
      return path.join(
        'three.js/editor',
        'verse-editor.html' + qs.stringify({ id: this.id }, true)
      )
    }
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
          path: '/verse/view?id=' + this.id,
          meta: { title: '【宇宙】' }
        },
        {
          path: '/verse/scene?id=' + this.id,
          meta: { title: '宇宙编辑' }
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
    ...mapMutations('breadcrumb', ['setBreadcrumbs']),
    async selected({ data, setup, title }) {
      this.postMessage({
        action: 'add-module',
        data: { data, setup, title }
      })
    },
    cancel() { 
    },
    postMessage(data) { 
      data.verify = 'mrpp.com';
      const iframe = document.getElementById('editor')
      iframe.contentWindow.postMessage(data, '*')
    },
    setupPrefab({ meta_id, data, uuid }) {
      getPrefab(meta_id).then(response => {
        this.$refs.knightData.open({
          schema:JSON.parse(response.data.data),
          data: JSON.parse(data),
          callback: (setup) => {
            this.postMessage({
              action: 'setup-module',
              data: { uuid, setup }
            })
          }
        })
      })
       
     
    },
    addPrefab() { 
      this.$refs.prefabDialog.open()
      this.$message({
              type: 'info',
              message: '添加预设'
            })
    },
    addMeta() { 
      this.$refs.metaDialog.open()
      this.$message({
              type: 'info',
              message: '添加模块'
            })
    },
    async handleMessage(e) {
     
      const self = this
      if (e.data.from === 'mrpp-editor') {
        switch (e.data.action) {
          case 'edit-meta':
            this.$router.push({
              path: '/meta/scene',
              query: { id: e.data.data.meta_id}
            })
            break
          case 'setup-prefab':
            self.setupPrefab(e.data.data)
            break;
          case 'add-meta':
            self.addMeta();
           
           break
          case 'add-prefab':
            self.addPrefab();
           
           break
          case 'save-verse':
            self.saveVerse(e.data.data)

            break
          case 'goto':
            if (e.data.data == 'blockly.js') {
              this.$router.push({
                path: '/verse/script',
                query: { id: this.id, title: this.title }
              })
            }
            break
          case 'ready':
            if (this.init == false) {
              this.init = true
              const response = await getVerse(this.id, 'metas, resources')
              const verse = response.data
              console.error(verse)
             // alert("!")
             // alert( verse.editable)
              if (verse) {
                this.saveable = this.$can('editable', new AbilityEditable(verse.editable))
                
              } else { 
                this.saveable = false
              }

              const data = {
                action: 'load',
                id: this.id,
                data: verse,
                saveable: this.saveable
              }
              this.postMessage(data)
            }
            break
        }
      }
    },
    async saveVerse(verse) {
      if (!this.saveable) {
        this.$message({
          type: 'info',
          message: '没有保存权限!'
        })
        return
      }
      await putVerse(this.id, { data: verse }).then(response => {
        this.$message({
          type: 'success',
          message: '场景保存成功!!!'
        })
      })
      /*
      const verse = await getVerse(this.id)
      const data = {
        action: 'reload',
        data: verse.data
      }
      this.postMessage(data)*/
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
