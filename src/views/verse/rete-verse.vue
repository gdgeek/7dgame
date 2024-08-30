<template>
  <div>
    <knight-data-dialog ref="knightData" @submit="knightDataSubmit" />
    <knight-setup-dialog
      @selected="knightSelect"
      @cancel="clearKnight()"
      ref="knightSetup"
    />
    <space-dialog
      @selected="spaceSelect"
      @cancel="clearSpace()"
      ref="spaceDialog"
    />
   
    
    <el-container>
      <el-main>
        <el-card v-loading="loading" class="box-card">
          <div v-if="verse" slot="header" class="clearfix">
            【宇宙】{{ verse.name }}

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
              <el-button v-else type="primary" size="mini" @click="arrange()">
                <font-awesome-icon icon="project-diagram" />
                整理
              </el-button>
            </el-button-group>
          </div>
          <div class="rete" ref="rete" />
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import editor from '@/node-editor/verse'
import { putVerse } from '@/api/v1/verse'

import { mapMutations } from 'vuex'
import { getVerse } from '@/api/v1/verse'
var randomWords = require('random-words')
import { v4 as uuidv4 } from 'uuid'
import SpaceDialog from '@/components/MrPP/SpaceDialog.vue'
import KnightDataDialog from '@/components/MrPP/KnightDataDialog.vue'
import KnightSetupDialog from '@/components/MrPP/KnightSetupDialog.vue'

import { AbilityEditable } from '@/ability/ability'

async function sleep(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(null)
    }, time)
  })
}
export default {
  components: {
    KnightSetupDialog,
    SpaceDialog,
    KnightDataDialog
  },

  data() {
    return {
      banKnight: [],
      loading: false,
      knight: { callback: null },
      space: { callback: null },
      id: parseInt(this.$route.query.id),
      verse: null,
    }
  },

  async mounted() {
    editor.initVerse({
      container: this.$refs.rete,
      verse_id: this.id,
      root: this
    })

    const response = await getVerse(this.id, 'metaKnights,share')

    this.verse = response.data
    if (this.verse.data == null) {
      this.verse.data = JSON.stringify({
        type: 'Verse',
        parameters: {
          uuid: uuidv4(),
          space: {
            id: -1,
            occlusion: false
          }
        },
        children: {
          metas: []
        }
      })
    }

    const data = JSON.parse(this.verse.data)
   
    if (!data.children.modules) {
      data.children.modules = []
    }
    //初始化数据
    await editor.setup(data)
    await this.arrange()

    if (!this.saveable) {
      editor.ban()
    }
  },

  created() {
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
          path: '.',
          meta: { title: '宇宙编辑' }
        }
      ]
    })
  },
  destroyed() {
    this.setBreadcrumbs({
      list: []
    })
  },
  computed: {
    saveable() {
      if (this.verse === null) {
        return false
      }
      return this.$can('editable', new AbilityEditable(this.verse.editable))
    }
  },
  methods: {
    ...mapMutations('breadcrumb', ['setBreadcrumbs']),
    knightDataSubmit(data) {
      console.error(data)
    },
    metaForm(params) {
    
      this.$refs.knightData.open(params)
    },
    createMetaKnight() {
      this.$refs.knightSetup.open()
    },
    clearSpace() {
      this.space.callback = null
    },
    openSpace({ value, callback }) {
      if (this.saveable) {
        this.space.callback = callback
        if (this.space.callback) {
          this.$refs.spaceDialog.open(value, this.id)
        }
      }
    },
    spaceSelect(data) {
      if (this.space.callback !== null) {
        this.space.callback(data)
      }
    },
    setupKnight(data) {
      if (this.saveable) {
        this.$refs.knightSetup.open(data)
      }
    },

   
    clearKnight() {
      this.knight.callback = null
    },
    async knightSelect({ data,setup }) {
   
       await editor.addModule({
        meta_id : data.id,
        data : JSON.stringify(setup)
      })
    },
    _setVerseName(name) {
      this.verse.name = name
    },
    _addMeta(meta) {
      this.verse.metas.push(meta)
    },
    _deleteMeta(meta_id) {
      const index = this.verse.metas.findIndex(item => {
        if (item.id === meta_id) {
          return true
        }
        return false
      })
      if (index !== -1) {
        this.verse.metas.splice(index, 1)
      }
    },
   

    async save() {
     
      const self = this
      const verse_id = this.id

      if (self.saveable) {
      
        const data = await editor.save()
      
        await putVerse(verse_id, {
          data
        })

        this.$message({
          message: '保存成功',
          type: 'success'
        })
        await this.arrange()
      }
    },

    async arrange() {
      await editor.arrange()
      await sleep(300)
  
      await editor.arrange()
    }
  },

  beforeDestroy() {
    if (this.saveable) {
      this.save()
    }
  }
}
</script>

<style slang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
/*
#rete {
  width: 100%;
  height: 1000px;
}
*/

.rete {
  max-width: 100%;
  min-height: calc(73vh);
  max-height: calc(73vh);

  border-style: solid;
  border-width: 1px;
}

.node .control input,
.node .input-control input {
  width: 140px;
}

select,
input {
  width: 100%;
  border-radius: 30px;
  background-color: white;
  padding: 2px 6px;
  border: 1px solid #999;
  font-size: 110%;
  width: 170px;
}
</style>
