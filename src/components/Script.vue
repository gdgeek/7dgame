<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="逻辑编辑" name="blockly" />
      <el-tab-pane label="代码查看！" name="script" />
    </el-tabs>
    <div
      v-show="activeName === 'blockly'"
      id="blocklyDiv"
      style="height: 600px; width: 100%"
    />
    <el-card v-if="activeName === 'script' && script !== ''" class="box-card">
      <div v-highlight>
        <pre>
          <code class="lua">{{ script }}</code>
        </pre>
      </div>
    </el-card>
  </div>
</template>

<script>
import Blockly from 'blockly'
import toolbox from '@/assets/js/blockly/verse/toolbox'
import { AddBlocks } from '@/assets/js/blockly/verse/blocks'

import 'blockly/lua'

export default {
  name: 'Script',
  props: {
    blockly: {
      type: String,
      require: true
    },
    id: {
      type: Number,
      require: true
    },
    resource: {
      type: Object,
      require: true
    }
  },

  data() {
    return {
      workspace: null,
      activeName: 'blockly',
      script: ''
    }
  },

  mounted() {
    AddBlocks({
      resource: this.resource
    })
    this.workspace = Blockly.inject('blocklyDiv', {
      media: 'resource/blockly/media/',
      toolbox: toolbox,
      grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
      move: {
        scrollbars: {
          horizontal: false,
          vertical: true
        },
        drag: true,
        wheel: false
      },
      zoom: {
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        controls: true,
        wheel: true,
        pinch: true
      }
    })
    if (this.blockly) {
      this.load(this.blockly)
    }
  },
  methods: {
    load(data) {
      Blockly.serialization.workspaces.load(JSON.parse(data), this.workspace)
    },
    handleClick(tab, event) {
      if (this.activeName === 'script') {
        this.script =
          'local verse = {}\nlocal is_playing = false\n\n' +
          Blockly.Lua.workspaceToCode(this.workspace)
      }
      console.log(tab, event)
    },

    async save() {
      const data = Blockly.serialization.workspaces.save(this.workspace)

      try {
        const script =
          'local verse = {}\nlocal is_playing = false\n\n' +
          Blockly.Lua.workspaceToCode(this.workspace)

        this.$emit('submit', this.id, JSON.stringify(data), script, () => {
          this.$message({
            message: '代码保存成功',
            type: 'success'
          })
        })
      } catch (e) {
        this.$message({
          message: e.message,
          type: 'error'
        })
      }
    }
  }
}
</script>
