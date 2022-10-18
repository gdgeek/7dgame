/*!
 * rete-vue-render-plugin v0.5.1
 * (c) 2021 Vitaliy Stoliarov
 * Released under the MIT license.
 */
import { postMeta, deleteMeta } from '@/api/v1/meta'
//var randomWords = require('random-words')
let removeNope = -1
// editor.connect(n1.outputs.get('num'), add.inputs.get('num'))
function install(editor, options) {
  editor.on('noderemove', async component => {
    if (component.name !== 'Meta' || editor.silent) {
      return true
    }
    const id = component.data['id']

    if (id !== -1) {
      removeNope = component.id
      setTimeout(() => {
        removeNope = -1
      })
      try {
        await deleteMeta(id)
        console.log('delete ok' + id)
      } catch (e) {
        console.error(e)
      }
    } else {
      return false
    }
    return true
  })
  editor.on('connectionremove', connection => {
    if (connection.output.node.id === removeNope) {
      return true
    }

    return false
  })
  editor.on('nodecreate', async component => {
    if (component.name !== 'Meta' || editor.silent) {
      return true
    }

    //component.controls.get('title').setId(123)

    if (typeof component.data['meta'] !== 'undefined') {
      component.data['id'] = component.data['meta'].id
      component.data['title'] = component.data['meta'].name
    }

    let id = component.data['id']

    if (typeof id === 'undefined') {
      const response = await postMeta({
        verse_id: options.verseId
      })
      const data = response.data
      id = data.id
      component.controls.get('id').setValue(id)

      const verse = editor.nodes.find(n => n.name === 'Verse')
      if (verse !== null) {
        editor.connect(component.outputs.get('out'), verse.inputs.get('metas'))
      }
    }
    setTimeout(() => {
      component.controls.get('title').$emit('setId', id)
    })

    return true
  })
}
export default {
  name: 'rete-meta',
  install: install
}