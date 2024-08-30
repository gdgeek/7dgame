import { defineAbility } from '@casl/ability'
import Vue from 'vue'

import { abilitiesPlugin } from '@casl/vue'
const ability = defineAbility((can, cannot) => {})

import { UpdateAbility } from '@/ability/ability'
UpdateAbility(ability, [], -1)
// ability
Vue.use(abilitiesPlugin, ability, {
  useGlobalProperties: true
})
export default ability
