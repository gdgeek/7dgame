<template>
  <div class="meta-edit">
    <edit  @getItem="getMeta" @putItem="putMeta"/>
  </div>
</template>

<script>
import Edit from '@/components/Meta/Edit.vue'
import { getMeta, putMeta } from '@/api/v1/meta'
export default {
  components: {
    Edit
  },
  
  methods: {
    async getMeta(id, expand, callback) { 
      const response = await getMeta(id, expand);
      callback(response.data)
     
    },
    async putMeta(id, data, callback) { 

      const response = await putMeta(id, data);
      callback(response.data)
     
    }
  }
}
</script>
