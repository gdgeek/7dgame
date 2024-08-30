<template>
  <span>
    <span v-for="(tags, tegindex) in message.messageTags" :key="tegindex">
      <span
        v-if="
          tagsMap.get(tags.tag_id).managed === 0 && canDelete(message.author_id)
        "
        title="删除标签"
      >
        <el-tag
          v-if="tags.tag_id !== 0"
          closable
          :type="tagsMap.get(tags.tag_id).type"
          size="mini"
          :color="tagsMap.get(tags.tag_id).color"
          style="margin-left: 6px"
          @click="searchTagId(tags.tag_id)"
          @close="removeTagsId(message.id, tags.tag_id)"
        >
          <span class="tagawesome">{{ tagsMap.get(tags.tag_id).name }}</span>
        </el-tag>
      </span>
      <span v-else>
        <el-tag
          v-if="tags.tag_id !== 0"
          :type="tagsMap.get(tags.tag_id).type"
          size="mini"
          :color="tagsMap.get(tags.tag_id).color"
          style="margin-left: 6px; cursor: pointer"
          @click="searchTagId(tags.tag_id)"
        >
          <span>{{ tagsMap.get(tags.tag_id).name }}</span>
        </el-tag>
      </span>
    </span>
    <!-- 增加标签 -->
    <el-dropdown
      v-if="
        canUpdate(message.author_id) &&
        message.messageTags.length !== tagsMap.size
      "
      slot="dropdown"
      placement="bottom"
    >
      <span title="增加标签">
        <el-tag
          class="el-icon-plus tagawesome"
          size="mini"
          type="info"
          style="margin-left: 6px"
          color="#FFF"
        />
      </span>
      <el-dropdown-menu align="center">
        <small style="font-size: 12px; color: #666666; font-weight: 700">
          增加标签
        </small>
        <el-dropdown-item
          v-for="(tag, index) in tagsMap"
          :key="index"
          style="padding: 0"
        >
          <div
            v-if="tag[1].managed === 0"
            v-show="ridSameTags(message.messageTags, tag[0])"
            style="width: 80px; text-align: center"
            @click="saveTagsAdd(message.id, tag[0])"
          >
            <el-tag :type="tag[1].type" :color="tag[1].color" size="mini">
              {{ tag[1].name }}
            </el-tag>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>
<script>
import { removeMessageTag, addMessageTag } from '@/api/v1/tags'
import { AbilityWorks } from '@/ability/ability'
export default {
  props: {
    tagsMap: {
      type: Map,
      require: true
    },
    message: {
      type: Object,
      require: true
    }
  },
  methods: {
    saveTagsAdd: function (message_id, tag_id) {
      const self = this
      addMessageTag(message_id, tag_id)
        .then(res => {
          const data = res.data
          self.message.messageTags.push(data)
        })
        .catch(function (error) {
          console.error(error)
        })
        .finally(() => {
          this.$message({
            message: '添加新标签',
            type: 'success'
          })
        })
    },
    removeTagsId: function (message_id, tag_id) {
      const self = this
      this.$confirm('此操作将删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(() => {
          self.deleteTags(message_id, tag_id)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    deleteTags: function (messageid, tagid) {
      const self = this
      removeMessageTag(messageid, tagid)
        .then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(function (error) {
          console.log(error)
        })
        .finally(() => {
          for (const [index, item] of self.message.messageTags.entries()) {
            if (item.tag_id === tagid) {
              self.message.messageTags.splice(index, 1)
            }
          }
        })
    },
    ridSameTags(messageTags, tag_id) {
      for (const item of messageTags) {
        if (tag_id === item.tag_id) {
          return false
        }
      }
      return true
    },
    canUpdate(author_id) {
      const self = this
      return self.$can('update', new AbilityWorks(author_id))
    },
    canDelete(author_id) {
      const self = this
      return self.$can('delete', new AbilityWorks(author_id))
    },
    searchTagId(tag_id) {
      this.$router.push({
        path: '/community/index',
        query: { tag: tag_id }
      })
    }
  }
}
</script>
