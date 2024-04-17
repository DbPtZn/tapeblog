//axios二次封装
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
// import { BASE_URL } from './BASE_URL'

// axios.defaults.baseURL = BASE_URL.NOTE
// 添加请求拦截器
// 在发送请求之前做些什么
axios.interceptors.request.use(config => {
  if (!config?.headers) {
    throw new Error(`Expected 'config' and 'config.headers' not to be undefined`)
  }
  return config
})
// 添加响应拦截器
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response
  },
  err => {
    // 对响应错误做点什么
    if (err.response?.status) {
      switch (err.response?.status) {
        case 401:
          console.log('服务器禁止请求')
          break
        case 403:
          console.log('服务器禁止请求')
          break
      }
    }
    return Promise.reject(err)
  }
)

export default axios
