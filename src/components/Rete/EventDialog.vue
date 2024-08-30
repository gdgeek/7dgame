<template>
  <div>
    <el-dialog
      :title="'事件管理窗口'"
      :visible.sync="visible"
      width="80%"
      :before-close="handleClose"
    >
      <div>
        <el-divider content-position="left">输出事件</el-divider>
        <span v-for="(item, key, index) in this.output.list" :key="index">
          <el-tag type="success" closable @close="deleteOutput(item)">
            {{ item.title }}
          </el-tag>
          <el-divider direction="vertical"></el-divider>
        </span>
        <span v-if="this.output.list.length <= 5">
          <el-input
            class="input-new-tag"
            v-if="output.visible"
            v-model="output.value"
            ref="saveTagOutput"
            size="small"
            @keyup.enter.native="handleOutputConfirm"
            @blur="handleOutputConfirm"
          ></el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showOutput"
          >
            + 输出事件
          </el-button>
        </span>

        <el-divider content-position="left">输入事件</el-divider>
        <span v-for="(item, key, index) in this.input.list" :key="index">
          <el-tag type="success" closable @close="deleteInput(item)">
            {{ item.title }}
          </el-tag>
          <el-divider direction="vertical"></el-divider>
        </span>
        <span v-if="this.input.list.length <= 5">
          <el-input
            class="input-new-tag"
            v-if="input.visible"
            v-model="input.value"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
          >
            + 输入事件
          </el-button>
        </span>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="enter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
export default {
  props: {
    uuid: {
      type: String,
      default: -1
    },
    node: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      visible: false,
      input: {
        visible: false,
        value: '',
        list: []
      },
      output: {
        visible: false,
        value: '',
        list: []
      }
    }
  },

  methods: {
    open() {
      this.$nextTick(function () {
        this.input.list = []
        if (this.node) {
          this.node.inputs.forEach(element => {
            this.input.list.push(element)
          })
          this.output.list = []
          this.node.outputs.forEach(element => {
            this.output.list.push(element)
          })
        }
        this.visible = true
      })
    },
    close() {
      this.visible = false
    },
    handleInputConfirm() {
      if (this.input.value) {
        this.input.list.push({ title: this.input.value, uuid: uuidv4() })
      }
      this.input.visible = false
      this.input.value = ''
    },
    handleOutputConfirm() {
      if (this.output.value) {
        this.output.list.push({ title: this.output.value, uuid: uuidv4() })
      }
      this.output.visible = false
      this.output.value = ''
    },

    deleteOutput(item) {
      this.output.list = this.output.list.filter(function (obj) {
        return obj.uuid != item.uuid
      })
    },
    deleteInput(item) {
      this.input.list = this.input.list.filter(function (obj) {
        return obj.uuid != item.uuid
      })
    },
    showInput() {
      this.input.visible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    showOutput() {
      this.output.visible = true
      this.$nextTick(_ => {
        this.$refs.saveTagOutput.$refs.input.focus()
      })
    },
    enter() {
      this.$emit('postEvent', {
        node: this.node,
        inputs: this.input.list,
        outputs: this.output.list,
        uuid: this.uuid
      })
    },
    handleClose(done) {
      done()
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
</style>
