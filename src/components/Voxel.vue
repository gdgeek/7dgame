<template>
  <div>
    <div id="three" style="height: 300px; width: 100%" />
  </div>
</template>

<script>
import ElementResizeDetector from 'element-resize-detector'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Vector3,
  Box3,
  DirectionalLight,
  AmbientLight,
  PointLight,
  MeshPhysicalMaterial,
  Mesh
} from 'three'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import {
  VOXLoader,
  VOXMesh,
  VOXData3DTexture
} from '@/assets/js/voxel/VOXLoader.js'

import {  convertToHttps} from '@/assets/js/helper'

function toFixedVector3(vec, n) {
  const result = new Vector3()
  result.x = parseFloat(vec.x.toFixed(n))
  result.y = parseFloat(vec.y.toFixed(n))
  result.z = parseFloat(vec.z.toFixed(n))
  return result
}

export default {
  name: 'Three',
  components: {},
  props: {
    file: {
      type: Object,
      require: true
    },
    target: {
      type: Number,
      default: 1.5
    }
  },
  data() {
    return {
      scene: null,
      renderer: null,
      camera: null,
      sleep: false
    }
  },

  watch: {
    file: function () {
      const self = this
      if (this.file !== null) {
        self.refresh()
      }
    }
  },
  mounted: function () {
    const self = this
    const content = document.getElementById('three')

    const width = content.clientWidth
    const height = content.clientHeight
    self.scene = new Scene()
    self.camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
    self.camera.position.set(0, 0, 2)
    self.renderer = new WebGLRenderer({
      preserveDrawingBuffer: true,
      antialias: true
    })
    self.renderer.setViewport(0, 0, width, height)
    self.renderer.setSize(width, height)
    self.renderer.setClearColor(0xeeffff, 1)
    content.appendChild(self.renderer.domElement)

    const controls = new OrbitControls(self.camera, self.renderer.domElement)

    // controls.update() must be called after any manual changes to the camera's transform
    // self.camera.position.set(0, 20, 100)
    controls.update()

    //  canvas.appendChild(renderer.domElement) /**/
    const light = new DirectionalLight(0xffffff, 1)
    light.position.set(-0.5, 0, 0.7)

    //let l = await this.light();
    self.scene.add(light)
    self.scene.add(new PointLight(0xffffff, 3))
    const ambient = new AmbientLight(0xffffff, 1)
    self.scene.add(ambient)

    function animate() {
      requestAnimationFrame(animate)
      controls.update()
      self.renderer.render(self.scene, self.camera)
    }

    animate()

    const erd = new ElementResizeDetector()
    erd.listenTo(content, () => {
      if (!self.sleep) {
        const width = content.clientWidth
        const height = content.clientHeight
        // self.renderer.setViewport(0, 0, width, height)
        self.renderer.setSize(width, height)
        self.camera.aspect = width / height
        self.camera.updateProjectionMatrix()
      }
    })

    self.refresh()
  },
  methods: {
    async parseNode(json) {
      return new Promise(async (resolve, reject) => {
        try {
          var loader = new THREE.ObjectLoader()
          const data = await loader.parseAsync(json)
          resolve(data)
        } catch (e) {
          alert(e)
          reject(e)
        }
      })
    },
    async light() {
      /*
      const light = {
        metadata: {
          version: 4.5,
          type: 'Object',
          generator: 'Object3D.toJSON'
        },
        object: {
          uuid: '10331223-0128-441b-b358-c3016a6ecc2f',
          type: 'Group',
          name: 'Room',
          layers: 1,
          matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
          children: [
            {
              uuid: 'f4c131be-dac2-4a72-8e72-fbabc4e430bb',
              type: 'PointLight',
              name: 'PointLight',
              layers: 1,
              matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
              color: 16777215,
              intensity: 1,
              distance: 0,
              decay: 1
            },
            {
              uuid: '9d42f72e-d9f3-4f4b-beff-069ab0922a89',
              type: 'DirectionalLight',
              name: 'DirectionalLight',
              layers: 1,
              matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 5, 10, 7.5, 1],
              color: 16777215,
              intensity: 1
            },
            {
              uuid: '8b6b5b36-c5ed-4c21-9453-a8dd04ca53fe',
              type: 'AmbientLight',
              name: 'AmbientLight',
              layers: 1,
              matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
              color: 2236962,
              intensity: 2
            }
          ]
        }
      }

      let node = await this.parseNode(light)

      return node
      */
    },
    screenshot() {
      return new Promise((resolve, reject) => {
        const self = this
        self.sleep = true
        // document.getElementById('canvas')
        self.renderer.setSize(512, 512)
        self.camera.aspect = 1 / 1
        self.camera.updateProjectionMatrix()
        self.renderer.render(self.scene, self.camera)
        const element = self.renderer.domElement

        element.toBlob(function (blob) {
          const content = document.getElementById('three')
          const width = content.clientWidth
          const height = content.clientHeight
          self.renderer.setSize(width, height)
          self.renderer.render(self.scene, self.camera)
          self.camera.aspect = width / height
          self.camera.updateProjectionMatrix()
          self.sleep = false
          resolve(blob)
        }, 'image/jpeg')
      })
    },
    refresh() {
      const self = this

      if (self.scene !== null && this.file !== null) {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/three.js/examples/js/libs/draco/')
        const gltf = new GLTFLoader()
        gltf.setDRACOLoader(dracoLoader)
        const loader = new VOXLoader()
      
        loader.load(
          convertToHttps(self.file.url),

          function (chunks) {
            const chunk = chunks[0]
            const mesh = new VOXMesh(chunk)
            const box = new Box3().setFromObject(mesh)
            const center = new Vector3()
            box.getCenter(center)
            const size = new Vector3()
            box.getSize(size)
            const scale = self.target / size.x
            mesh.position.set(
              -center.x * scale,
              -center.y * scale,
              -center.z * scale
            )
            mesh.scale.set(scale, scale, scale)

            self.scene.add(mesh)
            self.$emit('loaded', {
              count:chunk.data.length/4,
              size: toFixedVector3(size, 5),
              center: toFixedVector3(
                new Vector3(center.x, center.y, center.z),
                5
              )
            })
          },
          // called while loading is progressing
          function (xhr) {
            self.$emit(
              'progress',
              parseFloat(((xhr.loaded / xhr.total) * 100).toFixed(1))
            )
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
          }
        )
      }
    }
  }
}
</script>
