<template>
  <span>
    <mr-p-p-verse-window-create
      ref="changedDialog"
      dialog-title="修改数据"
      dialog-submit="修 改"
      @submit="submitChange"
    />

    <mr-p-p-verse-qrcode ref="qrcode" />
    <el-button-group v-if="verse" style="float: right" :inline="true">
      <el-button type="plain" size="mini" @click="qrcode()">
        <font-awesome-icon icon="qrcode" />
      </el-button>

      <el-button
        v-if="saveable"
        type="plain"
        size="mini"
        icon="el-icon-edit"
        @click="changedWindow()"
      />
      <el-button
        v-if="deleteable"
        type="plain"
        size="mini"
        icon="el-icon-delete"
        @click="deletedWindow()"
      />
      &nbsp;
    </el-button-group>
  </span>
</template>

<script>
import { mapState } from 'vuex'
import { putVerse, deleteVerse } from '@/api/v1/verse'
import MrPPVerseQrcode from '@/components/MrPP/MrPPQRCodeVerse.vue'

import { AbilityEditable } from '@/ability/ability'

import MrPPVerseWindowCreate from '@/components/MrPP/MrPPVerseWindow/Create.vue'
export default {
  name: 'VerseToolbar',
  components: {
    MrPPVerseQrcode,
    MrPPVerseWindowCreate
  },
  props: {
    verse: {
      type: Object,
      default: null
    }
  },
  data() {
    return {}
  },
  computed: {
    deleteable() {
      if (this.verse === null) {
        return false
      }
      return this.$can('editable', new AbilityEditable(this.verse.editable))
    },
    saveable() {
      if (this.verse === null) {
        return false
      }
      return this.$can('editable', new AbilityEditable(this.verse.editable))
    }
  },
  methods: {
    qrcode() {
      this.$refs.qrcode.$emit('open', this.verse.id)
    },

    deletedWindow: function () {
      const self = this
      this.$confirm('此操作将永久销毁此【宇宙】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(() => {
          self.del()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    del: function () {
      const self = this

      deleteVerse(self.verse.id)
        .then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$emit('deleted', self.verse)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    submitChange(form, item, imageId) {
      const self = this
      const data = { name: form.name, info: JSON.stringify(form) }
      if (imageId !== null) {
        data.image_id = imageId
      }
      putVerse(self.verse.id, data).then(response => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.$refs.changedDialog.$emit('hide')
        this.$emit('changed', response.data)
      })
    },
    changedWindow: function () {
      const self = this
      this.$refs.changedDialog.$emit('show', self.verse)
    }
  }
}
</script>
