<template>
  <div>
    <el-breadcrumb class="app-breadcrumb" separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in list" :key="item.path">
          <span
            v-if="item.redirect === 'noRedirect' || index == list.length - 1"
            class="no-redirect font-text"
          >
            {{ item.meta.title }}
          </span>
          <a v-else @click.prevent="handleLink(item)">
            <span
              class="font-title"
              v-if="item.meta.title === '元宇宙实景编程平台'"
            >
              {{ item.meta.title }}
            </span>
            <span class="font-text" v-else>
              {{ item.meta.title }}
            </span>
          </a>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script>
import '@/assets/font/font.css'
import pathToRegexp from 'path-to-regexp'

import { mapState } from 'vuex'
export default {
  data() {
    return {
      levelList: null
    }
  },
  computed: {
    ...mapState({
      information: state => state.information
    }),
    list() {
      if (
        this.$store.state.breadcrumb.list !== null &&
        this.$store.state.breadcrumb.list.length !== 0
      ) {
        return this.$store.state.breadcrumb.list
      }
      const list = []
      for (let i = 0; i < this.levelList.length; ++i) {
        list.push({
          redirect: this.levelList[i].redirect,
          path: this.levelList[i].path,
          meta: this.levelList[i].meta
        })
      }

      return list
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    },
    '$store.state.breadcrumb.data': function () {
      //  alert(JSON.stringify(this.$store.state.breadcrumb.data))
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(
        item => item.meta && item.meta.title
      )
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [
          { path: '/', meta: { title: this.information.data.title } }
        ].concat(matched)
      }

      this.levelList = matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
