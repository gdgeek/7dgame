<template>
  <div class="script">
    <el-container>
      <el-main>
        <el-card v-loading="loading" class="box-card">
          <div v-if="script && verse" slot="header" class="clearfix">
            <el-button-group style="float: right">
              <el-button
                v-if="saveable"
                type="primary"
                size="mini"
                @click="save()"
              >
                <font-awesome-icon icon="save" />
                保存脚本
              </el-button>
            </el-button-group>
          </div>
          <blockly-script
            v-if="script !== null && verse !== null"
            ref="blockly"
            :blockly="script.workspace"
            :resource="resource"
            :id="this.script.id"
            @submit="submit"
          />
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import BlocklyScript from '@/components/Script.vue'
import { mapMutations } from 'vuex'
import {
  getVerseScript,
  postVerseScript,
  putVerseScript
} from '@/api/v1/verse-script'

import { v4 as uuidv4 } from 'uuid'
import { AbilityEditable } from '@/ability/ability'

import { getVerse, postVerse } from '@/api/v1/verse'
export default {
  name: 'VerseScript',

  components: {
    BlocklyScript
  },
  data() {
    return {
      loading: false,
      script: null,
      verse: null,
      titles: new Map()
    }
  },
  computed: {
    id() {
      return parseInt(this.$route.query.id)
    },
    resource() {
      const inputs = []
      const outputs = []
      this.verse.metas.forEach(meta => {
        let events = JSON.parse(meta.events)
        if (!events) {
          events = { inputs: [], outputs: [] }
        }
        events.inputs.forEach(input => {
          const data = this.map.get(meta.id)
          inputs.push({
            title: data.title + ':' + input.title,
            index: data.uuid,
            uuid: input.uuid
          })
        })

        events.outputs.forEach(input => {
          const data = this.map.get(meta.id)
          outputs.push({
            title: data.title + ':' + input.title,
            index: data.uuid,
            uuid: input.uuid
          })
        })
      })

      return {
        events: {
          inputs,
          outputs
        }
      }
    },
    saveable() {
      if (this.script === null) {
        return false
      }

      return this.$can('editable', new AbilityEditable(this.verse.editable))
    }
  },
  destroyed() {
    this.setBreadcrumbs({ list: [] })
  },
  async created() {
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
          meta: { title: '脚本编辑' }
        }
      ]
    })
    /*
    const response = await getVerseScript(this.id)

    this.script = response.data
    */
    this.loading = false

    const response = await getVerse(this.id, 'metas, module, share, script')

    console.log(response.data)
    this.verse = response.data
    if (!this.verse.script) {
      const vresponse = await postVerseScript({
        verse_id: this.id,
        title: 'script',
        uuid: uuidv4()
      })
      alert(JSON.stringify(vresponse.data))

      this.script = vresponse.data
    } else {
      this.script = this.verse.script
    }

    const data = JSON.parse(this.verse.data)
    /*data.children.metas.forEach(meta => {
      this.titles.set(meta.parameters.uuid, meta.parameters.title)
    })*/

    this.map = new Map()
    data.children.modules.forEach(module => {
      this.map.set(module.parameters.meta_id, {
        uuid: module.parameters.uuid,
        title: module.parameters.title
      })
    })

    this.setBreadcrumbs({
      list: [
        {
          path: '/',
          meta: { title: '元宇宙实景编程平台' }
        },
        {
          path: '/verse/view?id=' + this.verse.id,
          meta: { title: '宇宙【' + this.verse.name + '】' }
        },
        {
          path: '/verse/scene?id=' + this.verse.id,
          meta: { title: '场景编辑' }
        },
        {
          path: '.',
          meta: { title: '脚本编辑' }
        }
      ]
    })
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
    },
    async submit(id, blockly, code, end) {
      console.error(blockly)
      const response = await putVerseScript(id, {
        script: code,
        workspace: blockly
      })
      this.script = response.data

      end()
    }
  }
}
</script>
