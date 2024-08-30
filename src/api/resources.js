import request from '@/utils/request'
import { v4 as uuidv4 } from 'uuid'
import { convertToHttps } from '@/assets/js/helper'
var qs = require('querystringify')
var path = require('path')
function postResources(data) {
  data.uuid = uuidv4()

  const url = path.join('resources')
  return request({
    url,
    method: 'post',
    data
  })
}
export function postPolygen(data) {
  data.type = 'polygen'
  return postResources(data)
}

export function postVoxel(data) {
  data.type = 'voxel'
  return postResources(data)
}

export function postPicture(data) {
  data.type = 'picture'
  return postResources(data)
}

export function postVideo(data) {
  data.type = 'video'
  return postResources(data)
}

export function postAudio(data) {
  data.type = 'audio'
  return postResources(data)
}

function deleteResources(id) {
  const url = path.join('resources', id.toString())
  return request({
    url,
    method: 'delete'
  })
}
export function deletePolygen(id) {
  return deleteResources(id)
}
export function deleteVoxel(id) {
  return deleteResources(id)
}

export function deletePicture(id) {
  return deleteResources(id)
}
export function deleteVideo(id) {
  return deleteResources(id)
}
export function deleteAudio(id) {
  return deleteResources(id)
}

function putResources(id, resource) {
  const url = path.join('resources', id.toString())
  return request({
    url,
    method: 'put',
    data: resource
  })
}

export function putPolygen(id, polygen) {
  return putResources(id, polygen)
}

export function putVoxel(id, voxel) {
  return putResources(id, voxel)
}
export function putPicture(id, picture) {
  return putResources(id, picture)
}
export function putVideo(id, video) {
  return putResources(id, video)
}
export function putAudio(id, audio) {
  return putResources(id, audio)
}

export function getResources(
  type,
  sort = '-created_at',
  search = '',
  page = 0,
  expand = 'image,author'
) {
  let query = []
  query['type'] = type
  query['expand'] = expand
  query['sort'] = sort

  if (search !== '') {
    query['ResourceSearch[name]'] = search
  }
  if (page > 1) {
    query['page'] = page
  }

  const url = path.join('resources' + qs.stringify(query, true))
  return request({
    url,
    method: 'get'
  })
}
/*
export function getResourceList() {
  return request({
    url: '/resources',
    method: 'get'
  })
}*/
export function getPolygens(sort = '-created_at', search = '', page = 0) {
  return getResources('polygen', sort, search, page)
}
export function getVoxels(sort = '-created_at', search = '', page = 0) {
  return getResources('voxel', sort, search, page)
}

export function getPictures(sort = '-created_at', search = '', page = 0) {
  return getResources('picture', sort, search, page)
}
export function getVideos(sort = '-created_at', search = '', page = 0) {
  return getResources('video', sort, search, page)
}
export function getAudios(sort = '-created_at', search = '', page = 0) {
  return getResources('audio', sort, search, page)
}

export function getResource(type, id, expand = 'image,author') {
  let query = []
  query['type'] = type
  query['expand'] = expand
  return request({
    url: path.join('resources', id + qs.stringify(query, true)), // '/resources/' + id + '?expand=image,file,author&type=' + type,
    method: 'get'
  })
}
export async function getPolygen(id, expand = 'image,file,author') {
  return new Promise((resolve, reject) => {
    getResource('polygen', id, expand)
      .then(response => {
        if (response.data.file && response.data.file.url) {
          response.data.file.url = convertToHttps(response.data.file.url)
        }
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export async function getVoxel(id, expand = 'image,file,author') {
  return new Promise((resolve, reject) => {
    getResource('voxel', id, expand)
      .then(response => {
        if (response.data.file && response.data.file.url) {
          response.data.file.url = convertToHttps(response.data.file.url)
        }
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export async function getPicture(id, expand = 'image,file,author') {
  return new Promise((resolve, reject) => {
    getResource('picture', id, expand)
      .then(response => {
        if (response.data.file && response.data.file.url) {
          response.data.file.url = convertToHttps(response.data.file.url)
        }
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getVideo(id, expand = 'image,file,author') {
  return new Promise((resolve, reject) => {
    getResource('video', id, expand)
      .then(response => {
        if (response.data.file && response.data.file.url) {
          response.data.file.url = convertToHttps(response.data.file.url)
        }
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getAudio(id, expand = 'image,file,author') {
  return new Promise((resolve, reject) => {
    getResource('audio', id, expand)
      .then(response => {
        if (response.data.file && response.data.file.url) {
          response.data.file.url = convertToHttps(response.data.file.url)
        }
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
