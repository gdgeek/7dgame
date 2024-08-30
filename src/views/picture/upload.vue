<template>
  <div>
    <mr-p-p-upload
      dir="picture"
      :file-type="fileType"
      @saveResource="savePicture"
    >
      <div>选择图片并上传</div>
    </mr-p-p-upload>
  </div>
</template>

<script>
import MrPPUpload from '@/components/MrPP/MrPPUpload/index.vue'

import { postPicture } from '@/api/resources'
export default {
  name: 'PictureUpload',
  components: {
    MrPPUpload
  },
  data: function () {
    return {
      fileType: 'image/gif, image/jpeg, image/png'
    }
  },
  methods: {
    async savePicture(name, file_id, callback) {
      const self = this
      try {
        const response = await postPicture({ name, file_id })

        self.$router.push({
          path: '/picture/view',
          query: { id: response.data.id }
        })
      } catch (err) {
        console.error(err)
      }
      callback()
    }
  }
}
</script>
