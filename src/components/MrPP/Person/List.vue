<template>
  <div>
    <waterfall :options="{}">
      <!-- slice Control number of items -->
      <waterfall-item
        v-for="(item, index) in items"
        :key="index"
        style="width: 160px"
      >
        <el-card style="width: 150px" :body-style="{ padding: '0px' }">
          <img :src="getUrl(item)" class="image" />
          <div style="padding: 14px">
            <span>{{ item.username }}</span>
            <div class="bottom clearfix">
              <el-descriptions
                class="margin-top"
                :title="item.nickname"
                :column="1"
                size="mini"
              >
                <el-descriptions-item label="权限">
                  {{ getAblity(item.roles) }}
                </el-descriptions-item>
              </el-descriptions>
              <el-button type="text" class="button" @click="deleted(item)">
                删除
              </el-button>
            </div>
          </div>
        </el-card>

        <br />

        <br />
      </waterfall-item>
    </waterfall>
  </div>
</template>

<script>
import { Waterfall, WaterfallItem } from 'vue2-waterfall'
import { deletePerson } from '@/api/v1/person'
export default {
  name: 'PersonList',
  components: {
    Waterfall,
    WaterfallItem
  },
  props: {
    items: {
      type: Array
    }
  },
  methods: {
    getUrl(item) {
      if (!!item && !!item.avatar && !!item.avatar.url) {
        return item.avatar.url
      }

      return require('@/assets/image/author-boy.png')
    },
    getAblity(roles) {
      if (roles.includes('root')) {
        return '根用户'
      } else if (roles.includes('admin')) {
        return '超级管理员'
      } else if (roles.includes('manager')) {
        return '管理员'
      } else if (roles.includes('user')) {
        return '用户'
      }
      return JSON.stringify(roles)
    },
    refresh() {
      const self = this
      self.$emit('refresh')
    },

    deleted: async function (item) {
      const self = this
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(async () => {
          await deletePerson(item.id)

          await this.$message({
            type: 'success',
            message: '删除成功!'
          })

          self.refresh()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
</style>
