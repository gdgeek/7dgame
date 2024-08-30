function VoxelMesh() {}

VoxelMesh.prototype._size = function (view, size, child, end) {
  this.size = {}
  this.size.x = view.getUint32(view.tell(), true)
  this.size.y = view.getUint32(view.tell(), true)
  this.size.z = view.getUint32(view.tell(), true)
  setTimeout(end, 1)
}

VoxelMesh.prototype._xyzi = function (view, size, child, end) {
  var from = view.tell()
  this.voxNum = view.getUint32(view.tell(), true)
  this.vox = new Array()

  while (view.tell() - from < size) {
    var xyzc = new Array(
      view.getUint8(),
      view.getUint8(),
      view.getUint8(),
      view.getUint8()
    )
    this.vox.push(xyzc)
  }

  setTimeout(end, 1)
}

VoxelMesh.prototype._rgba = function (view, size, child, end) {
  var from = view.tell()

  this.rgba = new Array()
  while (view.tell() - from < size) {
    var rgba =
      (view.getUint8() << 24) |
      (view.getUint8() << 16) |
      (view.getUint8() << 8) |
      view.getUint8()
    this.rgba.push(rgba)
  }
  setTimeout(end, 1)
  //end();
}
VoxelMesh.prototype.readIt = function (view, end) {
  var name = view.getString(4)
  var size = view.getUint32(view.tell(), true)
  var child = view.getUint32(view.tell(), true)
  var offset = view.tell()
  var self = this

  switch (name) {
    case 'SIZE':
      this._size(view, size, child, end)
      break
    case 'XYZI':
      this._xyzi(view, size, child, end)

      break
    case 'RGBA':
      this._rgba(view, size, child, end)
      break

    default:
      setTimeout(end, 1)
      break
  }
}
VoxelMesh.prototype.readAsyn = function (view) {
  var dtd = $.Deferred()
  var tasks = function () {
    dtd.resolve()
  }
  this.readIt(view, tasks)
  return dtd.promise()
}
VoxelMesh.prototype.read = function (data, end) {
  var self = this
  var view = new jDataView(data)
  var vox = view.getString(4)

  if (vox == 'VOX ') {
    var version = view.getUint32(view.tell(), true)
    self.format = 1
    var asyn = function () {
      $.when(self.readAsyn(view)).done(function () {
        if (view.tell() < view.byteLength) {
          asyn()
        } else {
          setTimeout(end, 0)
        }
      })
    }

    asyn()
  }
}
