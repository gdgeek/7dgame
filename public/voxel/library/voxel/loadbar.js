// stats.js - http://github.com/mrdoob/stats.js
var Loadbar = function () {
  var l = Date.now(),
    m = l,
    g = 0,
    n = Infinity,
    o = 0,
    h = 0,
    p = Infinity,
    q = 0,
    r = 0,
    s = 0,
    f = document.createElement('div')
  //	f.id="voxel_loadbar";

  f.style.cssText =
    'width:100%;height:1%;padding:0 0 0 0;opacity:0.9;cursor:pointer;'
  var a = document.createElement('div')
  a.style.cssText =
    'height:100%;width:100%;padding:0 0 0 0;text-align:left;background-color:#0a0'
  f.appendChild(a)
  var lb = {}
  lb.REVISION = 1
  lb.domElement = f
  lb.part = 4
  lb.p = 0
  lb.start = function () {
    a.style.width = '0%'
    //$(a).css("width","0%");
    lb.p = 0
    lb.n = 0
  }
  lb.over = function () {
    lb.p = 0

    a.style.width = '100%'
    // $(a).css('width', '100%')
  }
  lb.stage = function (text, count) {
    lb.count = count
    lb.n = 0
    lb.p++
  }

  lb.step = function () {
    lb.n++
    var n = lb.n / lb.count / lb.part + (lb.p - 1) / lb.part
    var p = n * 97

    a.style.width = p + '%'
  }

  return lb
}
