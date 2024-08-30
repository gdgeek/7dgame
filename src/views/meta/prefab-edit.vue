<template>
  <div class="meta-edit">
    <edit  @getItem="getPrefab" @putItem="putPrefab"/>
  </div>
</template>

<script>
import Edit from '@/components/Meta/Edit.vue'
import { getPrefab, putPrefab } from '@/api/v1/prefab'
export default {
  components: {
    Edit
  },
  
  methods: {
    async getPrefab(id, expand, callback) { 
      const response = await getPrefab(id, expand);
      callback(response.data)
     
    },
    async putPrefab(id, data, callback) { 

      const response = await putPrefab(id, data);
      callback(response.data)
     
    }
  }
}
</script>
