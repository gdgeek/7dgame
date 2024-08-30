function Voxel(container, parameter) {
  var self = this
  self.container = container

  self.scene = new THREE.Scene()
  self.clock = new THREE.Clock()
  self.background = new THREE.BG()
  self.action = new VoxelAction(self.container, self)
  self.rotate = new THREE.Vector3(0, 0, 1)

  if (Detector.webgl) {
    self.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true
    })
  } else {
    self.renderer = new THREE.CanvasRenderer()
  }

  self.renderer.setClearColor(0x000000, 1)

  self.camera = new THREE.PerspectiveCamera(
    20,
    window.innerWidth / window.innerHeight,
    1,
    2000000
  )
  self.camera.position.z = 1400
  self.camera.position.y = 0

  var uniforms = this.background.uniforms
  uniforms.width.value = 100
  uniforms.height.value = 100
  uniforms.foreground.value.copy(new THREE.Color(0, 0, 0))
  uniforms.background.value.copy(new THREE.Color(0, 0, 0))
  this.scene.add(this.background.mesh)

  self.container.appendChild(self.renderer.domElement)

  window.addEventListener(
    'resize',
    function () {
      on_window_resize_(self)
    },
    false
  )

  on_window_resize_(self)
  self.animate()

  self.setParameter(parameter)
}
Voxel.prototype.setParameter = function (parameter) {
  var self = this
  if (parameter == null) {
    self.parameter = {}
    self.parameter.foreground = 0x000000
    self.parameter.background = 0x000000
  } else {
    self.parameter = parameter
  }
  self.refreshParameter()
}
Voxel.prototype.refreshParameter = function () {
  var self = this
  var foreground = self.parameter.foreground
  var background = self.parameter.background
  var uniforms = this.background.uniforms
  uniforms.foreground.value.copy(
    new THREE.Color(
      ((foreground >> 16) & 0xff) / 0xff,
      ((foreground >> 8) & 0xff) / 0xff,
      (foreground & 0xff) / 0xff
    )
  )
  uniforms.background.value.copy(
    new THREE.Color(
      ((background >> 16) & 0xff) / 0xff,
      ((background >> 8) & 0xff) / 0xff,
      (background & 0xff) / 0xff
    )
  )
}
Voxel.prototype.setTexture = function (texture) {
  var self = this
  self.texture = texture
}
Voxel.prototype.setBackground = function (color) {
  var self = this
  self.parameter.background = color
  self.refreshParameter()
}

Voxel.prototype.setForeground = function (color) {
  var self = this
  self.parameter.foreground = color
  self.refreshParameter()
}
Voxel.prototype.getParameter = function () {
  var self = this
  return self.parameter
}

Voxel.prototype.changeMesh = function (radius, mesh, end) {
  var self = this

  if (self.background) {
    self.scene.remove(self.scene.children[1])
  } else {
    self.scene.remove(self.scene.children[0])
  }

  new THREE.VoxelGeometry(radius, mesh, function (geometry) {
    self.object = self.createMesh(geometry)
    self.object.position = new THREE.Vector3(0, 0, 0)
    self.object.rotation.z = 3.14 + 0.5
    self.object.rotation.x = 3.14 / 2.0
    self.object.rotation.y = 3.14
    self.scene.add(self.object)
    self.isFree = true
    end(geometry)
  })
}

Voxel.prototype.change_mesh = Voxel.prototype.changeMesh

Voxel.prototype.free = function () {
  this.isFree = true
}

Voxel.prototype.createMesh = function (geometry) {
  var self = this
  var mesh = null
  if (Detector.webgl) {
    var material = new THREE.ShaderMaterial({
      uniforms: {
        resolution: { type: 'v2', value: new THREE.Vector2() },
        texture: {
          type: 't',
          value: new THREE.TextureLoader().load(self.texture)
        }
      },

      vertexShader: [
        'varying vec2 vUv;',
        'varying vec3 vColor;',
        'void main(){',
        'vUv = uv;',
        'vColor = vec3(color.r,  color.g,color.b);',
        'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
        'gl_Position = projectionMatrix * mvPosition;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float time;',
        'uniform vec2 resolution;',
        'uniform sampler2D texture;',
        'varying vec2 vUv;',
        'varying vec3 vColor;',
        'void main( void ) {',
        'vec3 color = texture2D( texture, vUv ).rgb;',
        'gl_FragColor = vec4( color.r * vColor.r, color.g* vColor.g, color.b* vColor.b, 1.0 );',
        '}'
      ].join('\n'),
      vertexColors: THREE.VertexColors
    })

    var materials = [material]

    var mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, materials)
  } else {
    var materials = [
      new THREE.MeshBasicMaterial({
        vertexColors: THREE.FaceColors,
        overdraw: 0.5
      }),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        shading: THREE.FlatShading,
        wireframe: true,
        transparent: true
      })
    ]

    mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, materials)
  }
  return mesh
}
//Voxel.prototype.create_mesh = Voxel.prototype.createMesh;

function animate_(self) {
  requestAnimationFrame(function () {
    animate_(self)
  })
  self.render()
}
Voxel.prototype.animate = function () {
  animate_(this)
}

Voxel.prototype.render = function () {
  var self = this
  var delta = this.clock.getDelta()
  if (self.object && !self.isFree)
    self.object.rotation.z += delta * self.rotate.z

  this.renderer.render(self.scene, self.camera)
}

function on_window_resize_(self) {
  var width =
    self.container.style.width ||
    self.container.clientWidth ||
    self.container.offsetWidth ||
    self.container.scrollWidth
  var height =
    self.container.style.height ||
    self.container.clientHeight ||
    self.container.offsetHeight ||
    self.container.scrollHeight

  self.camera.aspect = width / height
  self.background.uniforms.width.value = width
  self.background.uniforms.height.value = height

  self.camera.updateProjectionMatrix()
  self.renderer.setSize(width, height)
}
