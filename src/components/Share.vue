<template>
  <div>
    <el-dialog
      title="共享给其他用户"
      :visible.sync="post.visible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="post.form" ref="post" label-width="80px">
        <el-form-item
          label="用户名"
          prop="username"
          :rules="[
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ]"
        >
          <el-input
            type="username"
            v-model="post.form.username"
            placeholder="请输入用户名"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="相关信息" prop="content">
          <el-input type="textarea" v-model="post.form.content"></el-input>
        </el-form-item>
        <el-form-item label="编辑权限" prop="editable">
          <el-checkbox
            v-model="post.form.editable"
            label="可编辑"
            border
          ></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button-group :inline="true">
            <el-button size="mini" type="primary" @click="onPost()">
              确 认
            </el-button>

            <el-button size="mini" @click="post.visible = false">
              取 消
            </el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="修改共享信息"
      :visible.sync="put.visible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="put.form" ref="put" label-width="80px">
        <el-form-item
          label="用户名"
          prop="username"
          :rules="[
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ]"
        >
          {{ put.form.username }}
        </el-form-item>

        <el-form-item label="相关信息" prop="content">
          <el-input type="textarea" v-model="put.form.content"></el-input>
        </el-form-item>
        <el-form-item label="编辑权限" prop="editable">
          <el-checkbox
            v-model="put.form.editable"
            label="可编辑"
            border
          ></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button-group :inline="true">
            <el-button size="mini" type="primary" @click="onPut()">
              确 认
            </el-button>

            <el-button size="mini" @click="put.visible = false">
              取 消
            </el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-dialog>

    <br />
    <el-card>
      <div slot="header" class="clearfix">
        <b>【宇宙】共享</b>
      </div>
      <el-collapse v-if="items != null && items.length !== 0" accordion>
        <el-collapse-item v-for="item in items" :key="item.id">
          <template slot="title">
            <el-tooltip
              class="item"
              effect="light"
              :content="item.user.username"
              placement="top"
            >
              <div
                v-if="item.user.nickname !== '' && item.user.nickname !== null"
              >
                <i class="el-icon-edit" v-if="item.editable === 1"></i>
                <i class="el-icon-view" v-else></i>

                {{ item.user.nickname }}
              </div>
              <div v-else>
                <i class="el-icon-edit" v-if="item.editable === 1"></i>
                <i class="el-icon-view" v-else></i>

                {{ item.user.username }}
              </div>
            </el-tooltip>
          </template>
          <div>
            {{ JSON.parse(item.info).content }}
            <el-divider size="mini" content-position="right">
              <el-button-group size="mini" v-if="saveable">
                <el-button size="mini" @click="setup(item)">
                  <i class="header-icon el-icon-edit"></i>
                </el-button>
                <el-button size="mini" @click="del(item.id)">
                  <i class="header-icon el-icon-close"></i>
                </el-button>
              </el-button-group>
            </el-divider>
          </div>
        </el-collapse-item>
      </el-collapse>

      <br />
      <el-button
        v-if="saveable"
        style="width: 100%"
        @click="open()"
        type="primary"
        size="mini"
      >
        <font-awesome-icon icon="handshake" />
        &nbsp;共享给好友
      </el-button>
    </el-card>
  </div>
</template>

<script>
import { AbilityEditable } from '@/ability/ability'
import {
  postVerseShare,
  getVerseShares,
  deleteVerseShare,
  putVerseShare
} from '@/api/v1/verse-share'
export default {
  name: 'Share',
  props: {
    verse: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      items: null,

      post: {
        visible: false,
        form: {
          username: '',
          content: null,
          editable: true
        }
      },
      put: {
        visible: false,
        id: -1,
        form: {
          username: '',
          content: null,
          editable: true
        }
      }
    }
  },
  components: {},
  created() {
    this.refresh()
  },

  computed: {
    verseId() {
      return this.verse.id
    },
    saveable() {
      if (this.verse === null) {
        return false
      }
      return this.$can('editable', new AbilityEditable(this.verse.editable))
    }
  },
  methods: {
    async refresh() {
      try {
        const r = await getVerseShares(this.verseId)

        this.items = r.data
      } catch (e) {
        console.error(e.message)
      }
    },
    open() {
      this.post.visible = true
    },
    async setup(item) {
      this.put.form.username = item.user.username
      this.put.id = item.id
      this.put.form.content = JSON.parse(item.info).content

      this.put.form.editable = item.editable === 1
      this.put.visible = true
    },
    async del(id) {
      const self = this
      try {
        await this.$confirm('是否确认关闭共享？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        await deleteVerseShare(id)
        self.refresh()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    reset(ref) {
      this.$refs[ref].resetFields()
    },
    async onPut() {
      const self = this
      this.$refs['put'].validate(async valid => {
        if (valid) {
          try {
            const r = await putVerseShare(self.put.id, {
              username: self.put.form.username,
              verse_id: self.verseId,
              editable: self.put.form.editable ? 1 : 0,
              info: JSON.stringify({ content: self.put.form.content })
            })
          } catch (e) {}
          self.refresh()
          self.put.visible = false
        } else {
          console.log('error submit!!')
          self.put.visible = false
          return false
        }
      })
    },
    onPost() {
      const self = this
      this.$refs['post'].validate(valid => {
        if (valid) {
          postVerseShare({
            username: self.post.form.username,
            verse_id: self.verseId,
            editable: self.post.form.editable ? 1 : 0,
            info: JSON.stringify({ content: self.post.form.content })
          }).finally(() => {
            self.refresh()
            self.post.visible = false
          })
        } else {
          console.log('error submit!!')
          self.post.visible = false
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.info-content-label {
  width: 70px;
}
.icon {
  width: 10px;
}
</style>
