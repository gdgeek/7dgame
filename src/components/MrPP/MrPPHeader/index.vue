<template>
  <div>
    <el-card class="box-card">
      <el-row :gutter="0">
        <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
          <slot />
          &nbsp;
          <el-button-group v-if="sorted !== ''" :inline="true">
            <el-button
              v-if="sorted_name"
              size="mini"
              type="success"
              label="名称排序"
              icon="el-icon-chat-dot-square"
              @click="sort(sortByName)"
            >
              <span class="hidden-sm-and-down">名称排序</span>
              <i v-if="sorted_up" class="el-icon-arrow-up" />
              <i v-else class="el-icon-arrow-down" />
            </el-button>
            <el-button
              v-else
              size="mini"
              type="info"
              label="名称排序"
              icon="el-icon-chat-dot-square"
              @click="sort(sortByName)"
            >
              <span class="hidden-sm-and-down">名称排序</span>
            </el-button>
            <el-button
              v-if="sorted_created_at"
              size="mini"
              type="success"
              icon="el-icon-time"
              label="时间排序"
              @click="sort(sortByTime)"
            >
              <span class="hidden-sm-and-down">时间排序</span>
              <i v-if="sorted_up" class="el-icon-arrow-up" />
              <i v-else class="el-icon-arrow-down" />
            </el-button>
            <el-button
              v-else
              size="mini"
              type="info"
              label="时间排序"
              icon="el-icon-time"
              @click="sort(sortByTime)"
            >
              <span class="hidden-sm-and-down">时间排序</span>
            </el-button>
          </el-button-group>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
          <el-input
            v-model="input"
            size="mini"
            placeholder="搜索名称"
            class="input-with-select"
            @keyup.enter.native="keyDown"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              size="mini"
              @click="search"
            />
          </el-input>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
export default {
  name: 'MrPPHeader',
  props: {
    sorted: {
      type: String,
      required: true
    },
    searched: {
      type: String,
      required: true
    },
    sortByName: {
      type: String,
      default: 'name'
    },
    sortByTime: {
      type: String,
      default: 'created_at'
    }
  },
  data() {
    return {
      input: ''
    }
  },
  computed: {
    sorted_created_at() {
      return this.sorted.indexOf(this.sortByTime) !== -1
    },
    sorted_name() {
      return this.sorted.indexOf(this.sortByName) !== -1
    },
    sorted_up() {
      return this.sorted.indexOf('-') !== 0
    }
  },
  methods: {
    search() {
      this.$emit('search', this.input)
      this.input = ''
    },
    sort(value) {
      this.$emit('sort', (value === this.sorted ? '-' : '') + value)
    },
    keyDown(e) {
      if (e.keyCode === 13) {
        this.search()
      }
    }
  }
}
</script>

<style scoped>
.mrpp-title {
  font-size: 15px;
  padding: 0px 0px 0px 0px;
  color: #666;
}
</style>
