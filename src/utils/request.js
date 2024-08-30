import axios from 'axios'
import { Message } from 'element-ui'
import { getToken, removeToken } from '@/utils/auth'

import env from '@/environment.js'
import router from '@/router'
// create an axios instance
const service = axios.create({
  baseURL: env.replaceIP(env.api), // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    const token = getToken()
    if (token !== null) {
      //  const t = token + 'a'
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    return response
  },
  error => {
    console.error(error)
    if (
      (typeof error.response === 'undefined' &&
        error.message === 'Network Error') ||
      (typeof error.response !== 'undefined' && error.response.status === 401)
    ) {
      Message({
        message: '登陆过期，请重新登录',
        type: 'error',
        duration: 5 * 1000
      })
      removeToken()
      router.push({ path: '/site' })
      return Promise.reject('')
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      setTimeout(() => {
        let message = ''
        try {
          message = JSON.parse(error.response.data.message)
        } catch {
          if (typeof error.response === 'undefined') {
            message = error.message
          } else {
            message = error.response.data.message
          }
        }
        Message({
          message: message,
          type: 'error',
          duration: 5 * 1000
        })
      }, 300)

      return Promise.reject(error.response.data)
    }

    // return Promise.reject(error)
  }
)

export default service
