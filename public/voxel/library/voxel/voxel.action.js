function VoxelAction(element, voxel) {
  var self = this
  // do nothing in the event handler except canceling the event
  element.ondragstart = function (e) {
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    if (e && e.stopPropagation) {
      e.stopPropagation()
    }
    return false
  }

  // do nothing in the event handler except canceling the event
  element.onselectstart = function (e) {
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    if (e && e.stopPropagation) {
      e.stopPropagation()
    }
    return false
  }

  element.oncontextmenu = function (e) {
    return false
  }

  var canvasPosition = {
    x: element.offsetLeft,
    y: element.offsetTop
  }

  var state = 'none'
  var oro = null
  var begin = null

  if (navigator.userAgent.match(/mobile/i)) {
    // Touch events for mobile devices
  } else {
    element.addEventListener('mousedown', function (e) {
      if (e.button === 0) {
        // Left mouse button
        state = 'left'
        if (voxel) {
          voxel.free()
          oro = voxel.object.rotation
        }
      } else {
        // Right mouse button or others
        state = 'right'
        if (voxel) {
          voxel.free()
          oro = voxel.object.position
        }
      }
      begin = {
        x: e.pageX - canvasPosition.x,
        y: e.pageY - canvasPosition.y
      }

      element.style.cursor = 'move'
    })

    element.addEventListener('mouseup', function (e) {
      state = 'none'
      element.style.cursor = 'pointer'
    })

    element.addEventListener('mouseenter', function (e) {
      state = 'none'
      element.style.cursor = 'pointer'
    })

    element.addEventListener('mouseout', function (e) {
      state = 'none'
      element.style.cursor = 'default'
    })

    element.addEventListener('mouseleave', function (e) {
      state = 'none'
      element.style.cursor = 'default'
    })

    element.addEventListener('dblclick', function (e) {
      voxel.isFree = false
    })

    element.addEventListener('wheel', function (e) {
      if (voxel.object) {
        voxel.object.position.z += e.deltaY
      }
      e.preventDefault() // Prevent the page from scrolling
    })
    var last = null
    element.addEventListener('mousemove', function (e) {
      var mouse = {
        x: e.pageX - canvasPosition.x,
        y: e.pageY - canvasPosition.y
      }
      if (state === 'left') {
        oro.z += (mouse.x - last.x) * 0.01
        oro.x += (mouse.y - last.y) * 0.01
        voxel.object.rotation = oro
      } else if (state === 'right') {
        oro.x += mouse.x - last.x
        oro.y -= mouse.y - last.y
        voxel.object.position = oro
      }
      last = mouse
    })
  }
}
