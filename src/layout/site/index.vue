<template>
  <div :class="classObj" class="app-wrapper">
    <div class="background-screen-max">
      <horizontal v-if="!isMobile" />
      <vertical v-else :open-menu="openMenu" @selectedMenu="selectedMenu" />
    </div>

    <router-view class="background-screen-max" />
    <the-footer :maxwidth="true" />
  </div>
</template>

<script>
import Horizontal from '@/layout/site/menu/horizontal.vue'
import Vertical from '@/layout/site/menu/vertical.vue'

import TheFooter from '@/layout/components/Footer.vue'
const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design
import variables from '@/styles/variables.scss'

export default {
  components: {
    Horizontal,
    Vertical,
    TheFooter
  },
  data() {
    return {
      isMobile: false,
      openMenu: false
    }
  },
  computed: {
    menuClass() {
      return this.isMobile ? 'sidebar-container' : ''
    },
    variables() {
      return variables
    },
    menuMode() {
      return this.isMobile ? 'vertical' : 'horizontal'
    },
    classObj() {
      return {
        hideSidebar: !this.openMenu,
        openSidebar: this.openMenu,
        withoutAnimation: false,
        mobile: this.isMobile
      }
    }
  },
  mounted() {
    this.$_resizeHandler()
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  methods: {
    selectedMenu() {
      this.openMenu = !this.openMenu
    },
    toggleSideBar() {
      const self = this
      self.hamburger = !self.hamburger
    },
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler() {
      const self = this
      self.isMobile = self.$_isMobile()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';
@import '~@/styles/screenstyle.scss';
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
