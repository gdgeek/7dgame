<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="逻辑编辑" name="blockly" />
      <el-tab-pane label="代码查看" name="script" />
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
import toolbox from '@/assets/js/blockly/toolbox'
import { AddBlocks } from '@/assets/js/blockly/blocks'
import { putCyber } from '@/api/v1/cyber'

import 'blockly/lua'

export default {
  name: 'Coding',
  props: {
    cyber: {
      type: Object,
      require: true
    },
    meta: {
      type: Object,
      require: true
    },
    id: {
      type: Number,
      require: true
    },
    index: {
      type: String,
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
    if (this.meta.data) {
      AddBlocks({
        index: this.index,
        resource: this.getResource(this.meta)
      })
    }

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

    if (this.cyber && this.cyber.data) {
      this.load(this.cyber.data)
    }
    console.log(this.workspace)
  },
  methods: {
    getResource(meta) {
      const data = JSON.parse(meta.data)

      const ret = {
        action: [],
        trigger: [],
        polygen: [],
        picture: [],
        video: [],
        voxel: [],
        text: [],
        sound: [],
        entity: [],
        events: {
          inputs: [],
          outputs: [],
        },
      }
      ret.events = JSON.parse(meta.events)
      if(!ret.events) {
        ret.events = {}
      }
      if(!ret.events.inputs) {
        ret.events.inputs = []
      }
      if(!ret.events.outputs) {
        ret.events.outputs = []
      }
      this.addMetaData(data, ret)
      return ret
    },
    addMetaData(data, ret) {
      const self = this
      const action = self.testAction(data)
      if (action) {
        ret.action.push(action)
      }

      const entity = self.testPoint(data, [
        'polygen',
        'entity',
        'voxel',
        'video',
        'picture',
        'text',
        'voxel',
      ])

      if (entity) {
        ret.entity.push(entity)
      }

      const polygen = self.testPoint(data, ['polygen'])

      if (polygen) {
        ret.polygen.push(polygen)
      }

      const video = self.testPoint(data, ['video'])

      if (video) {
        ret.video.push(video)
      }

      const picture = self.testPoint(data, ['picture'])

      if (picture) {
        ret.picture.push(picture)
      }
      const sound = self.testPoint(data, ['sound'])

      if (sound) {
        ret.sound.push(sound)
      }

      const text = self.testPoint(data, ['text'])

      if (text) {
        ret.text.push(text)
      }
      const voxel = self.testPoint(data, ['voxel'])
    
      if (voxel) {
        ret.voxel.push(voxel)
      }

      if (typeof data.children !== 'undefined') {
        const keys = Object.keys(data.children)
        keys.forEach(key => {
          data.children[key].forEach(item => {
            self.addMetaData(item, ret)
          })
        })
      }
    },
    testAction(data) {
      if (
        data &&
        data.parameters &&
        typeof data.parameters !== 'undefined' &&
        typeof data.parameters.action !== 'undefined'
      ) {
        return {
          uuid: data.parameters.uuid,
          name: data.parameters.action,
          parameter: data.parameters.parameter
        }
      }
    },

    testPoint(data, typeList) {
      let ret
      typeList.forEach(type => {
        if (data.type.toLowerCase() === type.toLowerCase()) {
          ret = {
            uuid: data.parameters.uuid,
            name: data.parameters.name
          }
        }
      })
      return ret
    },
    load(data) {
      Blockly.serialization.workspaces.load(JSON.parse(data), this.workspace)
    },
    handleClick(tab, event) {
      if (this.activeName === 'script') {
        this.script =
          'local meta = {}\nindex = \'\'\n' + Blockly.Lua.workspaceToCode(this.workspace)
      }
      console.log(tab, event)
    },

    async save() {
      const self = this
      const data = Blockly.serialization.workspaces.save(this.workspace)
      if (self.cyber.data === JSON.stringify(data)) {
        return
      }

      try {
        const script =
           'local meta = {}\nindex = \'\'\n' + Blockly.Lua.workspaceToCode(this.workspace)

        const response = await putCyber(this.cyber.id, {
          data: JSON.stringify(data),
          script
        })

        this.$message({
          message: '代码保存成功',
          type: 'success'
        })

        // const scriptResponse = getCyberScript()
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
