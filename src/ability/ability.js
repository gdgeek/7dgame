import { AbilityBuilder, Ability } from '@casl/ability'

import env from '@/environment.js'
export class AbilityRouter {
  constructor(path) {
    this.path = path
  }
}

export class AbilityEditable {
  constructor(editable) {
    this.editable = editable
  }
}
export class AbilityViewable {
  constructor(viewable) {
    this.viewable = viewable
  }
}
export class AbilityWorks {
  constructor(id) {
    this.id = id
    //
  }
}

export class AbilityMessage {
  constructor(id, managed) {
    this.id = id
    this.managed = managed
  }
}
export function UpdateAbility($ability, roles, userId) {
  const { can, rules } = new AbilityBuilder(Ability)
  if (roles === null) {
    roles = []
  }

  let router = []
  let menu = []

  router = router.concat([
    '/site',
    '/site/logout',
    '/site/index',
    '/site/download',
    '/site/wechat-signup',
    '/site/binded-email',
    '/404',
    '/test',
    /^\/test[\/]/
  ])
  if (env.canWeb()) {
    router.push(/^\/web[\/]/)
  }
  if (env.canBlog()) {
    router.push(/^\/blog[\/]/)
  }

  if (env.canSetup()) {
    router.push(/^\/setup[\/]/)
  }

  if (env.canManager()) {
    router.push(/^\/setup[\/]/)
  }

  if (
    roles.find(role => role === 'root' || role === 'manager' || role === 'user')
  ) {
    can(['editable'], AbilityEditable.name, { editable: true })
    can(['viewable'], AbilityViewable.name, { viewable: true })

    can(['update', 'delete'], AbilityWorks.name, { id: userId })
    can(['delete'], AbilityMessage.name, { id: userId, managed: 0 })
    can(['update'], AbilityMessage.name, { id: userId })

    router = router.concat([
      '/verse/rete-verse',
      '/verse/verse-script',
      '/verse/script',
      '/meta/rete-meta',
      '/meta/script'
    ])
    menu = menu.concat([
      '/site/logout',
      '/resource/',
      /^\/polygen[\/]/,
      /^\/voxel[\/]/,
      /^\/space[\/]/,
      /^\/picture[\/]/,
      /^\/video[\/]/,
      /^\/home[\/]/,
      /^\/verse[\/]/,
      /^\/meta[\/]/,
      /^\/meta-verse[\/]/,
      /^\/settings[\/]/,
      /^\/discovery[\/]/,
      /^\/community[\/]/,
      /^\/editor[\/]/,
      /^\/audio[\/]/
    ])

    if (
      roles.find(
        role => role === 'root' || role === 'admin' || role === 'manager'
      )
    ) {
      can(['manager'])
      can(['editable'], AbilityEditable.name)
      can(['viewable'], AbilityViewable.name)
      can(['update', 'delete'], AbilityWorks.name)
      can(['delete'], AbilityMessage.name, { managed: 0 })
      can(['update'], AbilityMessage.name)
      menu = menu.concat(['/verse-share/open', /^\/trades[\/]/])
      menu = menu.concat([/^\/manager[\/]/])
      if (roles.find(role => role === 'root')) {
        can(['root'])
        // menu = menu.concat([/^\/knight[\/]/])
      }
    }
  }

  menu.forEach(item => {
    if (typeof item === 'string') {
      can(['open', 'goto'], AbilityRouter.name, { path: item })
    } else {
      can(['open', 'goto'], AbilityRouter.name, { path: { $regex: item } })
    }
  })
  router.forEach(item => {
    if (typeof item === 'string') {
      can('goto', AbilityRouter.name, { path: item })
    } else {
      can('goto', AbilityRouter.name, { path: { $regex: item } })
    }
  })

  $ability.update(rules)
}
