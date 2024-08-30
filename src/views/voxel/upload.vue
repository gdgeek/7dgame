<template>
  <div>
    <mr-p-p-upload dir="voxel" :file-type="fileType" @saveResource="saveVoxel">
      <div>选择模型（.vox文件），并上传</div>
    </mr-p-p-upload>
  </div>
</template>

<script>
import MrPPUpload from '@/components/MrPP/MrPPUpload'

import { postVoxel } from '@/api/resources'
export default {
  name: 'VoxelUpload',
  components: {
    MrPPUpload
  },
  data: function () {
    return {
      fileType: '.vox'
    }
  },
  methods: {
    saveVoxel(name, file_id, callback) {
      const self = this
      postVoxel({ name, file_id })
        .then(response => {
          console.log(response.data)

          self.$router.push({
            path: '/voxel/view',
            query: { id: response.data.id }
          })
        })
        .catch(err => {
          console.log(err)
        })
        .finally(callback)
    }
  }
}
</script>
