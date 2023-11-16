import { postMeta, putMeta } from './meta.js'
import { postVerse, putVerse } from './verse.js'
import { postMetaResource } from './meta-resource'
import { v4 as uuidv4 } from 'uuid'

async function initVerse(name, resource) {
  alert(1)
  const json = {
    name,
    description: '通过模型[' + resource.name + ']创建的简单场景。',
    course: -1
  }

  const data = {
    name,
    info: JSON.stringify(json),
    image_id: resource.image_id,
    version: 3
  }
  const response = await postVerse(data)
  return response.data
}
async function initMeta(verse, resource) {
  const data = {
    name: 'Polygen:' + resource.name,
    verse_id: verse.id,
    image_id: resource.image_id
  }
  const response = await postMeta(data)
  return response.data
}
async function updateMeta(meta, resource) {
  const info = JSON.parse(resource.info)
  const r = 0.5 / info.size.y
  const scale = { x: r, y: r, z: r }
  const position = {
    x: -info.center.x * r,
    y: -info.center.y * r,
    z: -info.center.z * r
  }
  const data = {
    type: 'MetaRoot',
    parameters: {
      uuid: uuidv4()
    },
    children: {
      entities: [
        {
          type: 'Polygen',
          parameters: {
            uuid: uuidv4(),
            name: 'expression',
            transform: {
              position,
              rotate: { x: 0, y: 0, z: 0 },
              scale
            },
            active: true,
            polygen: resource.id
          },
          children: {
            entities: [],
            components: []
          }
        }
      ],
      addons: [
        {
          type: 'Toolbar',
          parameters: {
            uuid: uuidv4(),
            destroy: false
          },
          children: { buttons: [] }
        }
      ]
    }
  }

  const response = await putMeta(meta.id, { data: JSON.stringify(data) })
  return response.data
}
async function updateVerse(verse, meta) {
  const data = {
    type: 'Verse',
    parameters: {
      uuid: uuidv4(),
      space: { id: -1, occlusion: false }
    },
    children: {
      metas: [
        {
          type: 'Meta',
          parameters: {
            uuid: uuidv4(),
            id: meta.id,
            title: 'polygen',
            transform: {
              position: { x: 0, y: 0, z: 2 },
              rotate: { x: 0, y: 0, z: 0 },
              scale: { x: 1, y: 1, z: 1 }
            },
            active: true
          }
        }
      ]
    }
  }
  const response = await putVerse(verse.id, { data: JSON.stringify(data) })
  return response.data
}
export function createVerseFromPolygen(name, resource) {
  return new Promise(async (resolve, reject) => {
    try {
      const verse = await initVerse(name, resource)
      const meta = await initMeta(verse, resource)
      const meta_resource = await postMetaResource({
        meta_id: meta.id,
        resource_id: resource.id
      })

      const verse2 = await updateVerse(verse, meta)
      const meta2 = await updateMeta(meta, resource)
      resolve({ verse: verse2, meta: meta2 })
    } catch (e) {
      reject(e)
    }
  })
}
