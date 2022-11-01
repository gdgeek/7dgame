/*!
 * rete-vue-render-plugin v0.5.1
 * (c) 2021 Vitaliy Stoliarov
 * Released under the MIT license.
 */
import { postMetaKnight, deleteMetaKnight } from '@/api/v1/meta-knight'
//var randomWords = require('random-words')
//let removeNope = -1
function install(editor, options) {
  editor.on('noderemove', async component => {
    if (component.name !== 'Knight' || editor.silent) {
      return true
    }
    const id = component.data['id']

    if (id > 0) {
      try {
        alert(id)
        await deleteMetaKnight(id)
        console.log('delete ok' + id)
      } catch (e) {
        console.error(e)
      }
    } else {
      return false
    }
    return true
  })

  editor.on('nodecreate', async component => {
    if (component.name !== 'Knight' || editor.silent) {
      return true
    }

    let id = component.data['id']

    if (typeof id === 'undefined') {
      const response = await postMetaKnight({
        verse_id: options.verseId
      })
      //alert(JSON.stringify(response))
      const data = response.data
      id = data.id
      component.controls.get('id').setValue(id)
    }
    setTimeout(() => {
      component.controls.get('knight').$emit('setId', id)
    })
    return true
  })
}
export default {
  name: 'rete-knight',
  install: install
}