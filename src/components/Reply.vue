<template>
  <div id="Reply">
    <el-container>
      <el-main style="padding-left: 0">
        <div class="block">
          <el-timeline>
            <el-timeline-item timestamp="现在就回复" placement="top">
              <el-form
                ref="form"
                :model="form"
                :rules="rules"
                label-width="0px"
                class="demo-ruleForm"
              >
                <el-form-item label="" prop="body">
                  <vue-editor
                    id="reply-editor"
                    v-model="form.body"
                    :editor-toolbar="customToolbar"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    style="float: right; padding: 5px 10px"
                    :disabled="isDisable"
                    @click="submitForm('form')"
                  >
                    <font-awesome-icon icon="edit" />
                    回复
                  </el-button>
                </el-form-item>
              </el-form>
            </el-timeline-item>
            <div v-if="replies === null">
              <el-timeline-item timestamp="loading..." placement="top">
                <el-skeleton :rows="3" animated />
              </el-timeline-item>
            </div>
            <div v-else>
              <el-timeline-item
                v-for="reply in replies"
                :key="reply.id"
                placement="top"
              >
                <div class="replytitle">
                  <div class="replyicon">
                    <img src="" alt="" class="el-icon-user" />
                  </div>
                  <div class="replynickname">{{ reply.author.nickname }}</div>
                </div>
                <el-card :body-style="{ padding: '15px 10px 0px 20px' }">
                  <div style="min-height: 80px" v-html="reply.body" />
                  <div
                    style="
                      float: right;
                      padding: 5px 10px 12px 0;
                      color: #8790a7;
                    "
                    class="bottom clearfix"
                  >
                    <span />
                    发布于
                    <time class="time">{{ reply.updated_at }}</time>
                    &nbsp; &nbsp;
                    <el-button
                      v-if="canDelete(reply)"
                      icon="el-icon-delete"
                      size="mini"
                      type="text"
                      @click="deletedWindow(reply.id, deletedReply)"
                    />
                  </div>
                </el-card>
              </el-timeline-item>
            </div>
            <el-pagination
              :current-page="pagination.current"
              :page-count="pagination.count"
              :page-size="pagination.size"
              :total="pagination.total"
              layout="prev, pager, next, jumper"
              background
              @current-change="handleCurrentChange"
            />
          </el-timeline>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getReplies, postReply, deleteReply } from '@/api/v1/reply'

import { AbilityWorks } from '@/ability/ability'
import { VueEditor } from 'vue2-editor'

import moment from 'moment'
moment.locale('zh-cn')
// import Doing2 from '@/views/document/workdata/doing/doing2'
export default {
  name: 'Reply',
  components: {
    VueEditor
  },
  data() {
    return {
      pagination: { current: 1, count: 1, size: 20, total: 20 },
      dialog: false,
      isDisable: false,
      customToolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['code-block']
      ],

      rules: {
        body: [
          { required: true, message: '请填写内容', trigger: 'blur' },
          { min: 10, message: '长度至少10个字符', trigger: 'blur' }
        ]
      },
      form: {
        body: ''
      },
      replies: null
    }
  },
  computed: {
    ...mapGetters(['userData']),
    ...mapState({
      tagsMap: state => state.tags.tagsMap
    })
  },
  props: {
    message_id: {
      type: Number,
      default: -1
    }
  },
  created() {
    const self = this
    self.refresh()
  },
  methods: {
    ...mapActions('tags', {
      refreshTags: 'refreshTags'
    }),

    handleCurrentChange: function (page) {
      this.pagination.current = page
      this.refresh()
    },
    refresh() {
      const self = this
      getReplies(self.message_id, '-created_at', self.current).then(r => {
        self.pagination = {
          current: parseInt(r.headers['x-pagination-current-page']),
          count: parseInt(r.headers['x-pagination-page-count']),
          size: parseInt(r.headers['x-pagination-per-page']),
          total: parseInt(r.headers['x-pagination-total-count'])
        }

        self.replies = r.data
      })
    },
    canDelete(item) {
      return this.$can('delete', new AbilityWorks(item.author_id))
    },

    deletedWindow: async function (id, deleted) {
      try {
        await this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        })
        deleted(id)
        this.$message({
          message: '确定删除'
        })
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    deletedReply: function (id) {
      const self = this
      deleteReply(id)
        .then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          const replies = []
          self.replies.forEach(item => {
            if (item.id !== id) {
              replies.push(item)
            }
          })
          self.replies = replies
        })
        .catch(function (error) {
          console.log(error)
        })
    },

    clear() {
      this.resetForm('form')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    async submitForm(formName) {
      const self = this
      self.isDisable = true
      setTimeout(() => {
        self.isDisable = false // 点击一次时隔三秒后才能再次点击
      }, 3000)
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const r = await postReply({
            body: self.form.body,
            message_id: self.message_id
          })

          self.clear()
          if (self.replies === null) {
            self.replies = []
          }
          const data = r.data
        
          //data.author_id = self.userData.id
          // data.updated_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          self.replies.unshift(data)
          self.$message({
            message: '回复成功',
            type: 'success'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.postheader {
  width: 100%;
  height: 100%;
  padding-left: 40px;
  line-height: 60px;
  font-weight: 500;
  font-size: 18px;
  color: #31829f;
  background-color: #f1f6f3;
}
.replytitle {
  position: relative;
  top: -9px;
  height: 32px;
  min-width: 200px;
}
.replyicon {
  float: left;
  width: 32px;
  height: 32px;
  background-color: rgb(205, 206, 199);
  text-align: center;
  line-height: 32px;
  border-radius: 50%;
}
.replynickname {
  float: left;
  height: 100%;
  line-height: 48px;
  margin-left: 6px;
  color: #444343;
}
</style>
