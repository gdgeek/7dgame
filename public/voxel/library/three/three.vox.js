THREE.BaseGeometry = function (end) {
  var that = this
  THREE.Geometry.call(this)

  this.type = 'PolyhedronGeometry'

  this.asyncRead(function () {
    that.mergeVertices()
    that.computeFaceNormals()
    end()
  })

  // Merge vertices
}

THREE.BaseGeometry.prototype = Object.create(THREE.Geometry.prototype)
THREE.BaseGeometry.prototype.constructor = THREE.BaseGeometry
THREE.BaseGeometry.prototype.prepare = function (vector, uv) {
  var that = this
  vector.index = that.vertices.push(vector) - 1
  vector.uv = uv
  return vector
}
THREE.BaseGeometry.prototype.make = function (v1, v2, v3, color) {
  var that = this
  var face = new THREE.Face3(v1.index, v2.index, v3.index, [
    v1.clone(),
    v2.clone(),
    v3.clone()
  ])

  face.vertexColors[0] = color
  face.vertexColors[1] = color
  face.vertexColors[2] = color
  face.color = color
  that.faces.push(face)

  that.faceVertexUvs[0].push([v1.uv, v2.uv, v3.uv])
}
THREE.BaseGeometry.prototype.asyncPrepare = function () {
  var that = this
  var range = 6000
  var l = this.input.vertices.length
  var i = 0

  that.addLoading(range, l, '处理立方体表面')

  return new Promise(function (resolve) {
    ; (function asyn() {
      that.asyncPrepareRange(l, i, range).then(function () {
        that.loading()
        if (i + range < l) {
          i += range
          asyn()
        } else {
          resolve()
        }
      })
    })()
  })
}

THREE.BaseGeometry.prototype.asyncPrepareRange = function (
  length,
  begin,
  range
) {
  var that = this
  return new Promise(function (resolve) {
    for (var j = begin; j < length && j < begin + range; j++) {
      that.prepare(that.input.vertices[j], that.input.uvs[j])
    }

    // Use setTimeout to simulate asynchronous behavior, resolving immediately after
    setTimeout(resolve, 0)
  })
}
THREE.BaseGeometry.prototype.asyncRadius = function () {
  var that = this
  var range = 8000
  var l = this.vertices.length
  var i = 0

  that.addLoading(range, l, '调整立方体位置')

  return new Promise(function (resolve) {
    ; (function asyn() {
      that.asyncRadiusRange(i, range).then(function () {
        that.loading()
        i += range
        if (i < l) {
          asyn()
        } else {
          resolve()
        }
      })
    })()
  })
}
THREE.BaseGeometry.prototype.asyncRadiusRange = function (begin, range) {
  var that = this
  return new Promise(function (resolve) {
    var l = that.vertices.length
    for (var j = begin; j < l && j < begin + range; j++) {
      that.vertices[j].multiplyScalar(that.input.radius)
    }

    // Use setTimeout to maintain the asynchronous behavior of the original method
    setTimeout(resolve, 0)
  })
}
THREE.BaseGeometry.prototype.asyncIndices = function () {
  var that = this
  var range = 4000
  var l = this.input.indices.length / 3
  var i = 0

  that.addLoading(range, l, '创建立方体索引')

  return new Promise(function (resolve) {
    ; (function asyn() {
      that.asyncIndicesRange(l, i, range).then(function () {
        that.loading()
        if (i + range < l) {
          i += range
          asyn()
        } else {
          resolve()
        }
      })
    })()
  })
}
THREE.BaseGeometry.prototype.asyncIndicesRange = function (
  length,
  begin,
  range
) {
  var that = this
  return new Promise(function (resolve) {
    for (var j = begin; j < length && j < begin + range; j++) {
      that.make(
        that.vertices[that.input.indices[j * 3]],
        that.vertices[that.input.indices[j * 3 + 1]],
        that.vertices[that.input.indices[j * 3 + 2]],
        that.input.colors[Math.floor(j / 2)]
      )
    }

    // Use setTimeout to maintain the asynchronous behavior of the original method
    setTimeout(resolve, 0)
  })
}

THREE.BaseGeometry.prototype.asyncRead = function (end) {
  var that = this

  that
    .asyncPrepare()
    .then(function () {
      return that.asyncIndices()
    })
    .then(function () {
      return that.asyncRadius()
    })
    .then(function () {
      end()
    })
    .catch(function (error) {
      console.error('An error occurred:', error)
    })
}

THREE.BaseGeometry.prototype.addLoading = function (range, length, text) {
  if (this.loadbar) {
    this.loadbar.stage(text, Math.ceil(length / range))
  } else {
    console.log(text + 'range' + Math.ceil(length / range))
  }
}
THREE.BaseGeometry.prototype.loading = function () {
  if (typeof this.loadbar != 'undefined') {
    this.loadbar.step()
  } else {
    console.log('do it')
  }
}
THREE.BaseGeometry.prototype.buildInput = function (
  voxel,
  maps,
  oft,
  colors,
  end
) {
  var that = this
  var p = {
    idx: 0,
    cdx: 0,
    map: maps,
    rgba: colors,
    oft: oft,
    vox: voxel
  }

  var range = 1000
  var l = p.vox.length
  var i = 0

  that.addLoading(range, l, '格式化立方体数据')

    // Wrap the asynchronous loop in a new Promise if needed
    ; (function asyn() {
      that.buildInputRange(p, i, range).then(function () {
        that.loading()
        if (i + range < l) {
          i += range
          asyn() // Recursively call asyn until condition is met
        } else {
          end() // Call the end function when done
        }
      })
    })()
}

THREE.BaseGeometry.prototype.buildInputRange = function (p, begin, range) {
  var that = this
  return new Promise(resolve => {
    for (var i = begin; i < p.vox.length && i < begin + range; i++) {
      var x = p.vox[i].x
      var y = p.vox[i].y
      var z = p.vox[i].z
      var color = new THREE.Color(p.rgba[p.vox[i].c - 1])

      if (!p.map['p_' + x + '_' + y + '_' + (z - 1)]) {
        this.input.vertices.push(
          new THREE.Vector3(
            x * 2 - 1 + p.oft.x,
            y * 2 - 1 + p.oft.y,
            z * 2 - 1 + p.oft.z
          ), //front
          new THREE.Vector3(
            x * 2 + 1 + p.oft.x,
            y * 2 - 1 + p.oft.y,
            z * 2 - 1 + p.oft.z
          ),
          new THREE.Vector3(
            x * 2 + 1 + p.oft.x,
            y * 2 + 1 + p.oft.y,
            z * 2 - 1 + p.oft.z
          ),
          new THREE.Vector3(
            x * 2 - 1 + p.oft.x,
            y * 2 + 1 + p.oft.y,
            z * 2 - 1 + p.oft.z
          )
        )

        var m = 0
        m |= p.map['p_' + (x + 1) + '_' + (y + 1) + '_' + (z - 1)] ? 1 : 0
        m |= p.map['p_' + x + '_' + (y + 1) + '_' + (z - 1)] ? 2 : 0
        m |= p.map['p_' + (x - 1) + '_' + (y + 1) + '_' + (z - 1)] ? 4 : 0

        m |= p.map['p_' + (x + 1) + '_' + y + '_' + (z - 1)] ? 8 : 0
        m |= p.map['p_' + (x - 1) + '_' + y + '_' + (z - 1)] ? 16 : 0

        m |= p.map['p_' + (x + 1) + '_' + (y - 1) + '_' + (z - 1)] ? 32 : 0
        m |= p.map['p_' + x + '_' + (y - 1) + '_' + (z - 1)] ? 64 : 0
        m |= p.map['p_' + (x - 1) + '_' + (y - 1) + '_' + (z - 1)] ? 128 : 0

        that.makeUV(m)
        that.input.indices.push(
          p.idx + 2,
          p.idx + 1,
          p.idx + 0,
          p.idx + 0,
          p.idx + 3,
          p.idx + 2
        )
        p.idx += 4

        that.input.colors[p.cdx] = new THREE.Color(
          color.r * 0.6,
          color.g * 0.6,
          color.b * 0.6
        )
        p.cdx += 1
      }
      if (!p.map['p_' + (x - 1) + '_' + y + '_' + z]) {
        that.input.vertices.push(
          new THREE.Vector3(
            x * 2 - 1 + p.oft.x,
            y * 2 + 1 + p.oft.y,
            z * 2 + 1 + p.oft.z
          ), //left
          new THREE.Vector3(
            x * 2 - 1 + p.oft.x,
            y * 2 - 1 + p.oft.y,
            z * 2 + 1 + p.oft.z
          ),
          new THREE.Vector3(
            x * 2 - 1 + p.oft.x,
            y * 2 - 1 + p.oft.y,
            z * 2 - 1 + p.oft.z
          ),
          new THREE.Vector3(
            x * 2 - 1 + p.oft.x,
            y * 2 + 1 + p.oft.y,
            z * 2 - 1 + p.oft.z
          )
        )

        var m = 0

        m |= p.map['p_' + (x - 1) + '_' + (y - 1) + '_' + (z - 1)] ? 1 : 0
        m |= p.map['p_' + (x - 1) + '_' + y + '_' + (z - 1)] ? 2 : 0
        m |= p.map['p_' + (x - 1) + '_' + (y + 1) + '_' + (z - 1)] ? 4 : 0

        m |= p.map['p_' + (x - 1) + '_' + (y - 1) + '_' + z] ? 8 : 0
        m |= p.map['p_' + (x - 1) + '_' + (y + 1) + '_' + z] ? 16 : 0

        m |= p.map['p_' + (x - 1) + '_' + (y - 1) + '_' + (z + 1)] ? 32 : 0
        m |= p.map['p_' + (x - 1) + '_' + y + '_' + (z + 1)] ? 64 : 0
        m |= p.map['p_' + (x - 1) + '_' + (y + 1) + '_' + (z + 1)] ? 128 : 0

        that.makeUV(m)
        that.input.indices.push(
          p.idx + 2,
          p.idx + 1,
          p.idx + 0,
          p.idx + 0,
          p.idx + 3,
          p.idx + 2
        )
        p.idx += 4

        that.input.colors[p.cdx] = new THREE.Color(
          color.r * 0.8,
          color.g * 0.8,
          color.b * 0.8
        )
        p.cdx += 1
      }
      if (!p.map['p_' + x + '_' + (y - 1) + '_' + z]) {
        that.input.vertices.push(
          new THREE.Vector3(
            x * 2 + 1 + p.oft.x,
            y * 2 - 1 + p.oft.y,
            z * 2 + 1 + p.oft.z
          ), //down
          new THREE.Vector3(
            x * 2 + 1 + p.oft.x,
            y * 2 - 1 + p.oft.y,
            z * 2 - 1 + p.oft.z
          ),
          new THREE.Vector3(
            x * 2 - 1 + p.oft.x,
            y * 2 - 1 + p.oft.y,
            z * 2 - 1 + p.oft.z
          ),
          new THREE.Vector3(
            x * 2 - 1 + p.oft.x,
            y * 2 - 1 + p.oft.y,
            z * 2 + 1 + p.oft.z
          )
        )

        var m = 0
        m |= p.map['p_' + (x - 1) + '_' + (y - 1) + '_' + (z - 1)] ? 1 : 0
        m |= p.map['p_' + x + '_' + (y - 1) + '_' + (z - 1)] ? 8 : 0
        m |= p.map['p_' + (x + 1) + '_' + (y - 1) + '_' + (z - 1)] ? 32 : 0

        m |= p.map['p_' + (x - 1) + '_' + (y - 1) + '_' + z] ? 2 : 0
        m |= p.map['p_' + (x + 1) + '_' + (y - 1) + '_' + z] ? 64 : 0

        m |= p.map['p_' + (x - 1) + '_' + (y - 1) + '_' + (z + 1)] ? 4 : 0
        m |= p.map['p_' + x + '_' + (y - 1) + '_' + (z + 1)] ? 16 : 0
        m |= p.map['p_' + (x + 1) + '_' + (y - 1) + '_' + (z + 1)] ? 128 : 0

        that.makeUV(m)
        that.input.indices.push(
          p.idx + 2,
          p.idx + 1,
          p.idx + 0,
          p.idx + 0,
          p.idx + 3,
          p.idx + 2
        )
        p.idx += 4

        that.input.colors[p.cdx] = new THREE.Color(
          color.r * 1,
          color.g * 1,
          color.b * 1
        )
        p.cdx += 1
      }

      if (!p.map['p_' + (x + 1) + '_' + y + '_' + z]) {
        that.input.vertices.push(
          new THREE.Vector3(
            x * 2 + 1 + p.oft.x,
            y * 2 + 1 + p.oft.y,
            z * 2 + 1 + p.oft.z
          ), //right
          new THREE.Vector3(
            x * 2 + 1 + p.oft.x,
            y * 2 + 1 + p.oft.y,
            z * 2 - 1 + p.oft.z
          ),
          new THREE.Vector3(
            x * 2 + 1 + p.oft.x,
            y * 2 - 1 + p.oft.y,
            z * 2 - 1 + p.oft.z
          ),
          new THREE.Vector3(
            x * 2 + 1 + p.oft.x,
            y * 2 - 1 + p.oft.y,
            z * 2 + 1 + p.oft.z
          )
        )

        var m = 0
        m |= p.map['p_' + (x + 1) + '_' + (y + 1) + '_' + (z + 1)] ? 128 : 0
        m |= p.map['p_' + (x + 1) + '_' + y + '_' + (z + 1)] ? 16 : 0
        m |= p.map['p_' + (x + 1) + '_' + (y - 1) + '_' + (z + 1)] ? 4 : 0

        m |= p.map['p_' + (x + 1) + '_' + (y + 1) + '_' + z] ? 64 : 0
        m |= p.map['p_' + (x + 1) + '_' + (y - 1) + '_' + z] ? 2 : 0

        m |= p.map['p_' + (x + 1) + '_' + (y + 1) + '_' + (z - 1)] ? 32 : 0
        m |= p.map['p_' + (x + 1) + '_' + y + '_' + (z - 1)] ? 8 : 0
        m |= p.map['p_' + (x + 1) + '_' + (y - 1) + '_' + (z - 1)] ? 1 : 0

        that.makeUV(m)
        that.input.indices.push(
          p.idx + 2,
          p.idx + 1,
          p.idx + 0,
          p.idx + 0,
          p.idx + 3,
          p.idx + 2
        )
        p.idx += 4

        that.input.colors[p.cdx] = new THREE.Color(
          color.r * 0.7,
          color.g * 0.7,
          color.b * 0.7
        )
        p.cdx += 1
      }

      if (!p.map['p_' + x + '_' + (y + 1) + '_' + z]) {
        that.input.vertices.push(
          new THREE.Vector3(
            x * 2 - 1 + p.oft.x,
            y * 2 + 1 + p.oft.y,
            z * 2 + 1 + p.oft.z
          ), //up
          new THREE.Vector3(
            x * 2 - 1 + p.oft.x,
            y * 2 + 1 + p.oft.y,
            z * 2 - 1 + p.oft.z
          ),
          new THREE.Vector3(
            x * 2 + 1 + p.oft.x,
            y * 2 + 1 + p.oft.y,
            z * 2 - 1 + p.oft.z
          ),
          new THREE.Vector3(
            x * 2 + 1 + p.oft.x,
            y * 2 + 1 + p.oft.y,
            z * 2 + 1 + p.oft.z
          )
        )

        var m = 0
        m |= p.map['p_' + (x - 1) + '_' + (y + 1) + '_' + (z + 1)] ? 128 : 0
        m |= p.map['p_' + x + '_' + (y + 1) + '_' + (z + 1)] ? 16 : 0
        m |= p.map['p_' + (x + 1) + '_' + (y + 1) + '_' + (z + 1)] ? 4 : 0

        m |= p.map['p_' + (x - 1) + '_' + (y + 1) + '_' + z] ? 64 : 0
        m |= p.map['p_' + (x + 1) + '_' + (y + 1) + '_' + z] ? 2 : 0

        m |= p.map['p_' + (x + 1) + '_' + (y + 1) + '_' + (z - 1)] ? 1 : 0
        m |= p.map['p_' + x + '_' + (y + 1) + '_' + (z - 1)] ? 8 : 0
        m |= p.map['p_' + (x - 1) + '_' + (y + 1) + '_' + (z - 1)] ? 32 : 0

        that.makeUV(m)
        that.input.indices.push(
          p.idx + 2,
          p.idx + 1,
          p.idx + 0,
          p.idx + 0,
          p.idx + 3,
          p.idx + 2
        )
        p.idx += 4
        //colors[j] = color;
        that.input.colors[p.cdx] = new THREE.Color(
          color.r * 1,
          color.g * 1,
          color.b * 1
        )
        p.cdx += 1
      }

      if (!p.map['p_' + x + '_' + y + '_' + (z + 1)]) {
        that.input.vertices.push(
          new THREE.Vector3(
            x * 2 + 1 + p.oft.x,
            y * 2 + 1 + p.oft.y,
            z * 2 + 1 + p.oft.z
          ), //back
          new THREE.Vector3(
            x * 2 + 1 + p.oft.x,
            y * 2 - 1 + p.oft.y,
            z * 2 + 1 + p.oft.z
          ),
          new THREE.Vector3(
            x * 2 - 1 + p.oft.x,
            y * 2 - 1 + p.oft.y,
            z * 2 + 1 + p.oft.z
          ),
          new THREE.Vector3(
            x * 2 - 1 + p.oft.x,
            y * 2 + 1 + p.oft.y,
            z * 2 + 1 + p.oft.z
          )
        )

        var m = 0
        m |= p.map['p_' + (x - 1) + '_' + (y - 1) + '_' + (z + 1)] ? 1 : 0
        m |= p.map['p_' + x + '_' + (y - 1) + '_' + (z + 1)] ? 8 : 0
        m |= p.map['p_' + (x + 1) + '_' + (y - 1) + '_' + (z + 1)] ? 32 : 0

        m |= p.map['p_' + (x - 1) + '_' + y + '_' + (z + 1)] ? 2 : 0
        m |= p.map['p_' + (x + 1) + '_' + y + '_' + (z + 1)] ? 64 : 0

        m |= p.map['p_' + (x - 1) + '_' + (y + 1) + '_' + (z + 1)] ? 4 : 0
        m |= p.map['p_' + x + '_' + (y + 1) + '_' + (z + 1)] ? 16 : 0
        m |= p.map['p_' + (x + 1) + '_' + (y + 1) + '_' + (z + 1)] ? 128 : 0
        /**/

        that.makeUV(m)
        that.input.indices.push(
          p.idx + 2,
          p.idx + 1,
          p.idx + 0,
          p.idx + 0,
          p.idx + 3,
          p.idx + 2
        )
        p.idx += 4

        that.input.colors[p.cdx] = new THREE.Color(
          color.r * 0.6 + 0.2,
          color.g * 0.6 + 0.2,
          color.b * 0.6 + 0.2
        )
        p.cdx += 1
      }

      p.map['p_' + p.vox[i].x + '_' + p.vox[i].y + '_' + p.vox[i].z] =
        p.vox[i].c
    }

    setTimeout(() => {
      resolve()
    }, 0)
  })
}

THREE.BaseGeometry.prototype.makeUV = function (i) {
  var that = this
  var unit = 1.0 / 16

  var u = (i & 0xf) * unit
  var v = 1.0 - unit * (((i >> 0x4) & 0xf) + 1) + 2 / 64
  that.input.uvs.push(
    new THREE.Vector2(u, v + unit / 2),
    new THREE.Vector2(u + unit / 2, v + unit / 2),
    new THREE.Vector2(u + unit / 2, v),
    new THREE.Vector2(u, v)
  )
}
///////////////
THREE.VoxelGeometry = function (radius, data, end, loadbar) {
  var that = this
  var mesh = null
  if (data.data) {
    mesh = data.data
  } else if (data.json) {
    mesh = data.json
  } else {
    mesh = data
  }

  this.loadbar = loadbar
  var vox = []
  if (!mesh.format || mesh.format == 0) {
    vox = mesh.vox
  } else if (mesh.format == 1) {
    vox = []
    for (var i = 0; i < mesh.vox.length; ++i) {
      var v = {}
      v.x = mesh.vox[i][0]
      v.y = mesh.vox[i][1]
      v.z = mesh.vox[i][2]
      v.c = mesh.vox[i][3]
      vox.push(v)
    }
  }

  var map = {}
  var box = new THREE.Vector3(-1, -1, -1)
  for (var i = 0; i < vox.length; ++i) {
    map['p_' + vox[i].x + '_' + vox[i].y + '_' + vox[i].z] = vox[i].c
    box.x = Math.max(vox[i].x, box.x)
    box.y = Math.max(vox[i].y, box.y)
    box.z = Math.max(vox[i].z, box.z)
  }

  var max = Math.max(box.x, box.y, box.z)
  radius = 200 / (max + 1)

  var palette = [
    0xffffff, 0xffffc5, 0xffff94, 0xffff62, 0xffff31, 0xffff00, 0xffc5ff,
    0xffc5c5, 0xffc594, 0xffc562, 0xffc531, 0xffc500, 0xff94ff, 0xff94c5,
    0xff9494, 0xff9462, 0xff9431, 0xff9400, 0xff62ff, 0xff62c5, 0xff6294,
    0xff6262, 0xff6231, 0xff6200, 0xff31ff, 0xff31c5, 0xff3194, 0xff3162,
    0xff3131, 0xff3100, 0xff00ff, 0xff00c5, 0xff0094, 0xff0062, 0xff0031,
    0xff0000, 0xc5ffff, 0xc5ffc5, 0xc5ff94, 0xc5ff62, 0xc5ff31, 0xc5ff00,
    0xc5c5ff, 0xc5c5c5, 0xc5c594, 0xc5c562, 0xc5c531, 0xc5c500, 0xc594ff,
    0xc594c5, 0xc59494, 0xc59462, 0xc59431, 0xc59400, 0xc562ff, 0xc562c5,
    0xc56294, 0xc56262, 0xc56231, 0xc56200, 0xc531ff, 0xc531c5, 0xc53194,
    0xc53162, 0xc53131, 0xc53100, 0xc500ff, 0xc500c5, 0xc50094, 0xc50062,
    0xc50031, 0xc50000, 0x94ffff, 0x94ffc5, 0x94ff94, 0x94ff62, 0x94ff31,
    0x94ff00, 0x94c5ff, 0x94c5c5, 0x94c594, 0x94c562, 0x94c531, 0x94c500,
    0x9494ff, 0x9494c5, 0x949494, 0x949462, 0x949431, 0x949400, 0x9462ff,
    0x9462c5, 0x946294, 0x946262, 0x946231, 0x946200, 0x9431ff, 0x9431c5,
    0x943194, 0x943162, 0x943131, 0x943100, 0x9400ff, 0x9400c5, 0x940094,
    0x940062, 0x940031, 0x940000, 0x62ffff, 0x62ffc5, 0x62ff94, 0x62ff62,
    0x62ff31, 0x62ff00, 0x62c5ff, 0x62c5c5, 0x62c594, 0x62c562, 0x62c531,
    0x62c500, 0x6294ff, 0x6294c5, 0x629494, 0x629462, 0x629431, 0x629400,
    0x6262ff, 0x6262c5, 0x626294, 0x626262, 0x626231, 0x626200, 0x6231ff,
    0x6231c5, 0x623194, 0x623162, 0x623131, 0x623100, 0x6200ff, 0x6200c5,
    0x620094, 0x620062, 0x620031, 0x620000, 0x31ffff, 0x31ffc5, 0x31ff94,
    0x31ff62, 0x31ff31, 0x31ff00, 0x31c5ff, 0x31c5c5, 0x31c594, 0x31c562,
    0x31c531, 0x31c500, 0x3194ff, 0x3194c5, 0x319494, 0x319462, 0x319431,
    0x319400, 0x3162ff, 0x3162c5, 0x316294, 0x316262, 0x316231, 0x316200,
    0x3131ff, 0x3131c5, 0x313194, 0x313162, 0x313131, 0x313100, 0x3100ff,
    0x3100c5, 0x310094, 0x310062, 0x310031, 0x310000, 0x00ffff, 0x00ffc5,
    0x00ff94, 0x00ff62, 0x00ff31, 0x00ff00, 0x00c5ff, 0x00c5c5, 0x00c594,
    0x00c562, 0x00c531, 0x00c500, 0x0094ff, 0x0094c5, 0x009494, 0x009462,
    0x009431, 0x009400, 0x0062ff, 0x0062c5, 0x006294, 0x006262, 0x006231,
    0x006200, 0x0031ff, 0x0031c5, 0x003194, 0x003162, 0x003131, 0x003100,
    0x0000ff, 0x0000c5, 0x000094, 0x000062, 0x000031, 0xe60000, 0xd50000,
    0xb40000, 0xa40000, 0x830000, 0x730000, 0x520000, 0x410000, 0x200000,
    0x100000, 0x00e600, 0x00d500, 0x00b400, 0x00a400, 0x008300, 0x007300,
    0x005200, 0x004100, 0x002000, 0x001000, 0x0000e6, 0x0000d5, 0x0000b4,
    0x0000a4, 0x000083, 0x000073, 0x000052, 0x000041, 0x000020, 0x000010,
    0xe6e6e6, 0xd5d5d5, 0xb4b4b4, 0xa4a4a4, 0x838383, 0x737373, 0x525252,
    0x414141, 0x202020, 0x101010, 0x080000
  ]
  that.input = {}
  that.input.vertices = []
  that.input.indices = []
  that.input.colors = []
  that.input.uvs = []
  that.input.radius = radius

  var offset = new THREE.Vector3(-box.x, -box.y, -box.z)
  var rgba = null
  if (mesh.rgba) {
    rgba = []
    if (!mesh.format || mesh.format == 0) {
      for (var i = 0; i < mesh.rgba.length; ++i) {
        rgba.push(
          (mesh.rgba[i].r << 16) | (mesh.rgba[i].g << 8) | mesh.rgba[i].b
        )
      }
    } else {
      for (var i = 0; i < mesh.rgba.length; ++i) {
        rgba.push(mesh.rgba[i] >> 8)
      }
    }
  } else {
    rgba = palette
  }

  this.type = 'VoxelGeometry'
  this.buildInput(vox, map, offset, rgba, function () {
    THREE.BaseGeometry.call(that, function () {
      end(that)
      //if(loadbar)
      //loadbar.over();
    })
  })
}

THREE.VoxelGeometry.prototype = Object.create(THREE.BaseGeometry.prototype)
THREE.VoxelGeometry.prototype.constructor = THREE.VoxelGeometry
