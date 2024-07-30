import defaultSettings from '@/settings.js'

import env from '@/environment.js'

const state = {
  data: [
    {
      label: '个人中心',
      url: '/home/index',
      icon: 'id-badge',
      items: [
        {
          label: '我的主页',
          url: '/home/index',
          icon: 'home'
        }
      ]
    },
    {
      label: '资源管理',
      url: '/resource/',
      icon: 'cubes',
      items: [
        {
          label: '体素管理',
          url: '/voxel/',
          icon: 'cubes',
          items: [
            {
              label: '体素列表',
              url: '/voxel/index',
              icon: 'list'
            },
            {
              label: '体素上传',
              url: '/voxel/upload',
              icon: 'upload'
            }
          ]
        },
        {
          label: '模型管理',
          url: '/polygen/',
          icon: 'cube',
          items: [
            {
              label: '模型列表',
              url: '/polygen/index',
              icon: 'list'
            },
            {
              label: '模型上传',
              url: '/polygen/upload',
              icon: 'upload'
            }
          ]
        },
        {
          label: '图片管理',
          url: '/picture/',
          icon: 'file-image',
          items: [
            {
              label: '图片列表',
              url: '/picture/index',
              icon: 'list'
            },
            {
              label: '图片上传',
              url: '/picture/upload',
              icon: 'upload'
            }
          ]
        },
        {
          label: '视频管理',
          url: '/video/',
          icon: 'file-video',
          items: [
            {
              label: '视频列表',
              url: '/video/index',
              icon: 'list'
            },
            {
              label: '视频上传',
              url: '/video/upload',
              icon: 'upload'
            }
          ]
        },
        {
          label: '音频管理',
          url: '/audio/',
          icon: 'file-audio',
          items: [
            {
              label: '音频列表',
              url: '/audio/index',
              icon: 'list'
            },
            {
              label: '音频上传',
              url: '/audio/upload',
              icon: 'upload'
            }
          ]
        }
      ]
    },
    {
      label: '元数据',
      url: '/meta/',
      icon: 'star',
      items: [
        {
          label: '元数据列表',
          url: '/meta/list',
          icon: 'list'
        },
        {
          label: '系统预设',
          url: '/meta/prefabs',
          icon: 'list'
        }
      ]
    },
    {
      label: '宇宙',
      url: '/verse/',
      icon: 'adjust',
      items: [
        {
          label: '自己创造',
          url: '/meta-verse/index',
          icon: 'list'
        },
        {
          label: '系统推荐',
          url: '/meta-verse/open',
          icon: 'list'
        },
        {
          label: '朋友分享',
          url: '/meta-verse/share',
          icon: 'list'
        }
      ]
    },/*
    {
      label: '场景',
      url: '/space/',
      icon: 'home',
      items: [
        {
          label: '场景列表',
          url: '/space/index/',
          icon: 'list'
        },
        {
          label: '场景上传',
          url: '/space/upload/',
          icon: 'upload'
        }
      ]
    },*/


    {
      label: '探索',
      url: '/discovery/',
      icon: 'compass',
      hidden: !env.canDocument(),
      items: [
        {
          label: '文档',
          url: '/discovery/document',
          icon: 'book'
        }
      ]
    },

    {
      label: '游戏',
      url: '/game/',
      icon: 'gamepad',
      items: [
        {
          label: '游戏配置',
          url: '/game/index',
          icon: 'gamepad'
        },
        {
          label: '地图配置',
          url: '/game/map',
          icon: 'map'
        },
      ]
    },
    {
      label: '交流',
      url: '/community/index',
      icon: 'address-card'
    },

    {
      hidden: !env.canManager(),
      label: '用户管理',
      url: '/manager/user',
      icon: 'users'
    },

    {
      label: '退出登录',
      url: '/site/logout',
      icon: 'reply'
    }
  ]
}

export default {
  state
}
