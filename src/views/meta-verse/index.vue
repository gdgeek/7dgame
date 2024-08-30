<template>
  <div class="verse-index">
    <page @loaded="loaded" :created="true" />
  </div>
</template>

<script>
import Page from '@/components/MrPP/MrPPVersePage.vue'
import axios from 'axios'
import { getVerses } from '@/api/v1/verse'
export default {
  name: 'VerseIndex',
  components: {
    Page
  },
  mounted() {
    const data = { id: 1 }
  },

  methods: {
    loaded(data, result) {
      getVerses(data.sorted, data.searched, data.current, 'image,author,share')
        .then(response => {
          const pagination = {
            current: parseInt(response.headers['x-pagination-current-page']),
            count: parseInt(response.headers['x-pagination-page-count']),
            size: parseInt(response.headers['x-pagination-per-page']),
            total: parseInt(response.headers['x-pagination-total-count'])
          }
          // console.error(response.data)
          result({ data: response.data, pagination: pagination })
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>
