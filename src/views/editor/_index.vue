<template>
  <div class="verse-index">
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
import env from '@/environment.js'
import { putVerse } from '@/api/v1/verse'
import { getVerse } from '@/api/v1/verse'
export default {
  name: 'VerseEditor',
  data() {
    const src = path.join(
      'three.js/editor',
      'space-editor.html' + qs.stringify({ id: this.$route.query.id }, true)
    )

    return {
      isInit: false,
      editor: null,
      data: null,
      src
    }
  },
  computed: {
    id() {
      return parseInt(this.$route.query.id)
    }
    /*,
    url() {
      const uri =
        env.api +
        path.join(
          '/v1/verses/',
          this.id + qs.stringify({ expand: 'datas,resources,space' }, true)
        )
      return uri
    }*/
  },
  created() {
    const self = this
    /* getMeta(this.id).then(response => {
      self.data = JSON.parse(response.data.data)

      if (this.editor !== null) {
        const data = { verify: 'mrpp.com', action: 'load', data: self.data }
        self.editor.contentWindow.postMessage(data, '*')
      }
    })*/
  },
  mounted() {
    const self = this
    window.addEventListener('message', async e => {
      if (e.data.from === 'mrpp-editor') {
        switch (e.data.action) {
          case 'save-verse':
            self.saveVerse(e.data.verse)
            break
          case 'ready':
            if (self.isInit == false) {
              self.isInit = true
              const iframe = document.getElementById('editor')
              const r = await getVerse(this.id)
              const data = {
                verify: 'mrpp.com',
                action: 'load',
                id: this.id,
                data: r.data
              }
              iframe.contentWindow.postMessage(data, '*')
            }
            break
        }
      }
    })
  },
  methods: {
    async saveVerse(verse) {
      await putVerse(this.id, {type:'custom', data: verse }).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!!'
        })
      })
      const r = await getVerse(this.id)
      const data = {
        verify: 'mrpp.com',
        action: 'reload',
        data: r.data
      }
      const iframe = document.getElementById('editor')
      iframe.contentWindow.postMessage(data, '*')
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
