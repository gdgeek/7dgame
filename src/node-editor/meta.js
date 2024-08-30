import Rete from 'rete'
import VueRenderPlugin from 'rete-vue-render-plugin'
import ConnectionPlugin from 'rete-connection-plugin'
import AreaPlugin from 'rete-area-plugin'
import AutoArrangePlugin from 'rete-auto-arrange-plugin'
import ContextMenuPlugin from 'rete-context-menu-plugin'
import LimitPlugin from '@/node-editor/plugins/limit'
import RandomStringPlugin from '@/node-editor/plugins/randomString'
import UUIDPlugin from '@/node-editor/plugins/uuid'
import { Component } from './components/Component'
import BanPlugin from '@/node-editor/plugins/ban'

import { Build } from '@/node-editor/factory'
import {
  MetaRoot,
  Polygen,
  Picture,
  Video,
  Sound,
  Text,
  Entity,
  Transparent,
  Rotate,
  LockedScale,
  ImageTarget,
  Toolbar,
  Button,
  Action,
  Tooltip,
  Billboard,
  Moved,
  Voxel
} from './type/metaEditor'

let editor_ = null
let engine_ = null

const save = async function () {
  await engine_.abort()
  let ret = null
  await engine_.process(editor_.toJSON(), null, function (data) {
    ret = data
  })
  return ret
}
/*
const save = async function () {
  editor_.trigger('process', { status: 'save' })
}*/
const arrange = function () {
  if (editor_.nodes.length > 0) {
    editor_.trigger('arrange', editor_.nodes)
  }
}
const ban = function () {
  editor_.use(BanPlugin)
}
const create = function (meta) {
  const data = {
    type: 'MetaRoot',
    parameters: {
      name: meta,
      transform: {
        position: { x: 0, y: 0, z: 0 },
        rotate: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      active: true
    },
    children: {
      entities: [],
      addons: []
    }
  }
  return setup(data)
}
const setup = async function (data) {
  await Build(editor_, data)
  setTimeout(() => {
    arrange()
    editor_.view.resize()
    AreaPlugin.zoomAt(editor_)
    editor_.silent = false
  }, 250)
}

const initMeta = async function ({ container, root }) {
  const types = [
    MetaRoot,
    Entity,
    Polygen,
    Picture,
    Voxel,
    Video,
    Sound,
    Text,
    Transparent,
    Rotate,
    LockedScale,
    ImageTarget,
    Toolbar,
    Button,
    Action,
    Tooltip,
    Billboard,
    Moved
  ]
  editor_ = new Rete.NodeEditor('MrPP@0.1.0', container)
  editor_.silent = true
  editor_.use(ConnectionPlugin)
  editor_.use(VueRenderPlugin)
  editor_.use(ContextMenuPlugin, {
    delay: 100,
    allocate(component) {
      if (typeof component.type_.allocate !== 'undefined') {
        return component.type_.allocate
      }

      return []
    },
    rename(component) {
      console.log(component)
      return component.name
    }
  })
  editor_.use(AutoArrangePlugin, { margin: { x: 50, y: 50 }, depth: 110 })
  editor_.use(AreaPlugin)
  editor_.use(LimitPlugin, [{ name: 'MetaRoot', max: 1, min: 1 }])
  editor_.use(RandomStringPlugin, [
    { component: 'Polygen', target: 'name' },
    { component: 'Video', target: 'name' },
    { component: 'Picture', target: 'name' },
    { component: 'Voxel', target: 'name' },
    { component: 'Sound', target: 'name' },
    { component: 'Text', target: 'name' },
    { component: 'Text', target: 'text' },
    { component: 'Entity', target: 'name' },
    { component: 'Button', target: 'title' },
    { component: 'Button', target: 'action' },
    { component: 'Action', target: 'action' },
    { component: 'Tooltip', target: 'text' }
  ])

  editor_.use(UUIDPlugin, [
    { component: 'Polygen', target: 'uuid' },
    { component: 'Video', target: 'uuid' },
    { component: 'Picture', target: 'uuid' },
    { component: 'Sound', target: 'uuid' },
    { component: 'Voxel', target: 'uuid' },
    { component: 'Text', target: 'uuid' },
    { component: 'Entity', target: 'uuid' },
    { component: 'Button', target: 'uuid' },
    { component: 'Action', target: 'uuid' },
    { component: 'Tooltip', target: 'uuid' },
    { component: 'Moved', target: 'uuid' }
  ])

  engine_ = new Rete.Engine('MrPP@0.1.0')
  types.forEach(type => {
    const component = new Component(type, root)
    editor_.register(component)
    engine_.register(component)
  })
  // editor_.register(new AddComponent())

  editor_.on('process', async e => {
    if (typeof e === 'object' && typeof e.status === 'string') {
      if (e.status === 'save') {
        await engine_.abort()
        await root.save()
        /*
        await engine_.process(editor_.toJSON(), null, async function (data) {
         
        })*/
      }
    }
  })

  //editor_.view.resize()
  //AreaPlugin.zoomAt(editor_)
  editor_.trigger('process', { status: 'init' })
  // editor_.trigger('save')

  // setTimeout(arrange, 100)
}

export default {
  initMeta,
  save,
  setup,
  create,
  arrange,
  ban
}
