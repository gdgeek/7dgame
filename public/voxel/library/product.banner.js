/**
 * Created by ruidi on 16/2/10.
 */
var voxel = null
var isLoading = false
var loadbar = {}
loadbar.part = 4
loadbar.p = 0
loadbar.stage = function (text, count) {
  console.log('stage' + text)
  loadbar.text = text
  loadbar.count = count
  loadbar.n = 0
  loadbar.p++
}

loadbar.start = function () {
  // $("#8bits").show();
}
loadbar.overtext = 'over!!!'
loadbar.step = function () {
  loadbar.n++
  var n =
    loadbar.n / loadbar.count / loadbar.part + (loadbar.p - 1) / loadbar.part
  var p = n * 100
  $('#loadbar').css('width', p + '%')
}
loadbar.over = function () {
  $('#8bits').hide()
  loadbar.p = 0
}

function OpenShowModal(name, file, parameter) {
  if (isLoading) return
  $('#scrollUp').click()
  LoadingMesh(name, file, parameter)
}
function LoadingMesh(name, file, parameter) {
  if (isLoading) return
  loadbar.start()
  isLoading = true
  var path = 'http://oss.7dgame.com/mesh/' + name

  $('#download').addClass('disabled')
  $.ajax(path, {
    type: 'get',
    dataType: 'text',
    cache: true,
    mimeType: 'text/plain; charset=x-user-defined',
    success: function (data) {
      if (data) {
        var mesh = new VoxelMesh()
        mesh.read(data, function () {
          loadbar.overtext = '总共处理<b>' + mesh.vox.length + '</b>个立方体'
          voxel.changeMesh(
            10,
            mesh,
            function () {
              var url = $.UrlUpdateParams(
                '/voxel.cn/basic/web/download/index',
                'name',
                name
              )
              url = $.UrlUpdateParams(url, 'file', file)
              $('#download').attr('href', url)
              $('#download').removeClass('disabled')
              isLoading = false
              loadbar.over()
            },
            loadbar
          )
          voxel.setParameter(parameter)
        })
      }
    }
  })
}
