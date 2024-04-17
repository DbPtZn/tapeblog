// import { localApi } from '@/api/local'
import { manageApi } from '@/api'
import { RoutePathEnum } from '@/enums'
import router from '@/router'
// import { LibraryEnum } from '@/enums'
import _ from 'lodash'
import { defineStore } from 'pinia'
export interface UserState {
  hostname: string
  account: string
  UID: string
  nickname: string
  avatar: string
  desc: string
  email: string
  phone: string
  receiverConfig: {
    status: 0 | 1 | 2
    autoParse: boolean
  }
}

export const useUserStore = defineStore('userStore', {
  state(): UserState {
    return {
      hostname: '',
      account: '',
      UID: '',
      nickname: '',
      avatar: '',
      desc: '',
      email: '',
      phone: '',
      receiverConfig: {
        status: 0,
        autoParse: false
      }
    }
  },
  actions: {
    /** 注册 */
    register(params: Parameters<typeof manageApi.auth.register>[0], hostname: string) {
      console.log(params, hostname)
      return manageApi.auth.register(params, hostname)
    },
    /** 登录 */
    login(params: Parameters<typeof manageApi.auth.login>[0], hostname: string) {
      return manageApi.auth.login(params, hostname).then(res => {
        console.log(res)
        if (!res.data) throw '登录失败'
        this.hostname = hostname
        // 存储 token
        sessionStorage.setItem(`managerToken`, res.data as string)
        sessionStorage.setItem(`hostname`, hostname)
        // 请求用户信息
        this.fetch().then(res => {
          const data = res.data
          if (data) {
            data.hostname = hostname
            this.set(data)
          }
        })
        return '登录成功'
      })
    },
    logout() {
      sessionStorage.removeItem(`managerToken`)
      sessionStorage.removeItem(`hostname`)
      this.$reset()
      router.push(RoutePathEnum.LOGIN)
    },
    /** 请求用户信息（token 存在的情况下才会生效） */
    fetch() {
      return manageApi.user.get<UserState>()
    },
    set(data: UserState) {
      const state: UserState = {
        hostname: data.hostname,
        account: data.account,
        UID: data.UID,
        nickname: data.nickname,
        avatar: data.avatar || '',
        desc: data.desc || '',
        email: data.email || '',
        phone: data.phone || '',
        receiverConfig: data.receiverConfig || {
          status: 0,
          autoParse: false
        }
      }
      // 特殊情况处理：
      // 1. 如果 hostname 为空
      if (!state.hostname) return console.warn('未设置主机名')
      // 2. 如果 account 为空
      if (!state.account) return console.warn('未设置账户')
      // 3. 如果用户信息已存在，则直接更新用户信息
      this.$patch(state)
      this.setCache(state)
    },
    fetchAndSet() {
      const data = this.getCache()
      const hostname = sessionStorage.getItem(`hostname`)
      const managerToken = sessionStorage.getItem(`managerToken`)
      if (hostname && managerToken) {
        if (data) {
          data.hostname = hostname
          this.set(data)
          return
        }
        this.fetch().then(res => {
          const data = res.data
          if (data) {
            data.hostname = this.hostname
            this.set(data)
          }
        })
      } else {
        this.logout()
      }
    },
    /** 设置缓存 */
    setCache(data: UserState) {
      localStorage.setItem(`user`, JSON.stringify(data))
    },
    getCache() {
      const str = localStorage.getItem('user')
      return str ? (JSON.parse(str) as UserState) : null
    },
    updateReceiverStatus(status: 0 | 1 | 2) {
      return manageApi.user.updateReceiverStatus(status).then(res => {
        this.receiverConfig.status = status 
        this.setCache(this.$state)
      })
    }
  },
  getters: {
    //
  }
})

// export default useUserStore

// /** 同一防抖函数被不同地方同时调用，只会接收最后一个 */
// const debounce2000A = _.debounce(func => {
//   func()
// }, 2000)
// const debounce2000B = _.debounce(func => {
//   func()
// }, 2000)
// const debounce2000C = _.debounce(func => {
//   func()
// }, 2000)
