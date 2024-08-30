<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="95%"
      height="95px"
      :show-close="false"
      @close="cancel()"
    >
      <span slot="title" class="dialog-footer">输入数据</span>
      <span slot="footer" class="dialog-footer">
        <template>
          <vue-form
            v-model="formData"
            :schema="schema"
            @on-submit="handlerSubmit"
            @on-cancel="handlerCancel"
            @on-change="handlerChange"
          ></vue-form>
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getMetaKnight, putMetaKnight } from '@/api/v1/meta-knight'
export default {
  name: 'KnightDataDialog',
  data() {
    return {
      formData: {},
      schema: {},
      id: null,
      dialogVisible: false,
      callback:null
    }
  },
  props: {},
  methods: {
    async handlerSubmit() {
      //this.$emit('submit', this.formData)
      //alert(JSON.stringify(this.formData))
      if(this.callback != null){
        this.callback(this.formData)
      }
     /* const response = await putMetaKnight(this.id, {
        info: JSON.stringify(this.formData)
      })
*/
      this.dialogVisible = false
    },
    handlerCancel() {
      this.dialogVisible = false
      this.$message.warning('点击了取消')
    },
    handlerChange({ oldValue, newValue }) {
      /*  const vNode = this.$createElement(
        'pre',
        JSON.stringify(newValue, null, 4)
      )
      this.$notify({
        title: '输入数据',
        message: vNode
      })*/
    },
    async open({ schema, callback, data}) {
   
      this.schema = schema
      this.callback = callback
  
      this.formData = data
     

      this.dialogVisible = true
    },
    cancel() {
      //  this.dialogVisible = false
    }
  }
}
</script>
