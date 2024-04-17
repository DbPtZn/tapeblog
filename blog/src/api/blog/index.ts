/** remote */
import { auth } from './auth'
import { user } from './user'
import { article } from './article'
import { collection } from './collection'
import { blogger } from './blogger'
import axios, { AxiosResponse } from 'axios'

// 为该用户创建请求体实例
export const baxios = axios.create()

baxios.interceptors.request.use(config => {
  if (!config?.headers) {
    throw new Error(`Expected 'config' and 'config.headers' not to be undefined`)
  }

  if (!config.baseURL) {
    config.baseURL = `http://localhost:8081`
  }
  return config
})

baxios.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response
  },
  err => {
    if (err.response?.status) {
      switch (err.response?.status) {
        case 401:
          break
        case 403:
          console.log('服务器禁止请求')
          break
      }
    }
    console.log(err)
    return Promise.reject(err)
  }
)

export const blogApi = {
  // user,
  // auth,
  article,
  collection,
  blogger
}
