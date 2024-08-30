<template>
  <span>
    <el-row>
      <el-col :span="4">
        <logo :collapse="false" style="float: left; right: 10px" />
      </el-col>
      <el-col :span="17">
        <el-menu :router="true" :default-active="$route.path" mode="horizontal">
          <el-menu-item
            v-for="(item, index) in data"
            :key="index"
            :index="item.path"
            class="font-text"
          >
            {{ item.text }}
          </el-menu-item>
        </el-menu>
      </el-col>

      <el-col :span="3">
        <login :_style="'float: right; width: 100%; padding: 12px'" />
      </el-col>
    </el-row>
  </span>
</template>

<script>
import '@/assets/font/font.css'
import variables from '@/styles/variables.scss'
import Logo from './logo.vue'
import Login from './login.vue'
import { data } from '@/layout/site/menu/data.js'
export default {
  components: {
    Logo,
    Login
  },
  computed: {
    data() {
      return data
    }
  },
  created() {
    console.error(data)
  }
}
</script>
