<template>
  <div>
    <resource-dialog
      @selected="selectResources"
      @cancel="openResources()"
      ref="dialog"
    />
    <el-container>
      <el-main>
        <el-card v-loading="loading" class="box-card">
          <div v-if="meta !== null" slot="header" class="clearfix">
           
            / 【元】{{ title }}
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

          <div v-show="visible" class="rete" ref="rete" />
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import editor from '@/node-editor/meta'
import { getMeta, putMeta } from '@/api/v1/meta'

import ResourceDialog from '@/components/MrPP/ResourceDialog.vue'
import { AbilityEditable } from '@/ability/ability'

import { mapMutations } from 'vuex'
export default {
  components: {
    ResourceDialog
  },
  data() {
    return {
      resource: {
        callback: null
      },
      loading: false,
      id: parseInt(this.$route.query.id),
      visible: true,
      meta: null
    }
  },
  computed: {
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

  async mounted() {
    editor.initMeta({
      container: this.$refs.rete,
      root: this
    })
    const response = await getMeta(this.id, 'verse,share')
    this.meta = response.data

    this.breadcrumb(this.meta)
    if (this.meta.data !== null) {
      await editor.setup(JSON.parse(this.meta.data))
    } else {
      await editor.create({
        name: this.meta.name,
        id: this.meta.id
      })
      await this.save()
    }
    this.loading = false
    if (!this.saveable) {
      editor.ban()
    }
  },

  created() {
    this.breadcrumb(null)
  },
  destroyed() {
    this.setBreadcrumbs({
      list: []
    })
  },
  beforeDestroy() {
    if (this.saveable) {
      this.save()
    }
  },
  methods: {
    ...mapMutations('breadcrumb', ['setBreadcrumbs']),
    breadcrumb(meta) {
      if (meta === null) {
        this.setBreadcrumbs({
          list: [
            {
              path: '/',
              meta: { title: '元宇宙实景编程平台' }
            },
            {
              path: '/meta-verse/index',
              meta: { title: '宇宙' }
            }
          ]
        })
      } else {
        this.setBreadcrumbs({
          list: [
            {
              path: '/',
              meta: { title: '元宇宙实景编程平台' }
            }
          ]
        })
      }
    },
    openResources(
      { value, callback, type } = { value: null, callback: null, type: null }
    ) {
      if (this.saveable) {
        this.resource.callback = callback

        if (callback !== null) {
          this.$refs.dialog.open(value, this.id, type)
        }
      }
    },
    selectResources(data) {
      if (this.resource.callback !== null) {
        this.resource.callback(data)
      }
    },

    async save() {
      if (this.saveable) {
        const data = await editor.save()
        await putMeta(this.id, {
          data
        })
        editor.arrange()
      }
    },
    async arrange() {
      editor.arrange()
    }
  }
}
</script>

<style lang="scss" scoped>
#rete {
  width: 100%;
  height: 1000px;
}

.node .control input,
.node .input-control input {
  width: 140px;
}

.rete {
  max-width: 100%;
  min-height: calc(73vh);
  max-height: calc(73vh);

  border-style: solid;
  border-width: 1px;
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
