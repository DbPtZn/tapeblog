// import { localApi } from '@/api/local'
import { blogApi } from '@/api'
import _ from 'lodash'
import { defineStore } from 'pinia'
interface Blogger {
  UID: string
  nickname: string
  avatar: string
  desc: string
  email: string
  phone: string
  createAt: string
}

export const useBloggerStore = defineStore('bloggerStore', {
  state(): Blogger {
    return {
      UID: '',
      nickname: '匿名',
      avatar: 'default_avator.png',
      desc: '',
      email: '',
      phone: '',
      createAt: ''
    }
  },
  actions: {
    get(UID: string) {
      return blogApi.blogger.get<Blogger>(UID).then(res => {
        this.$patch(res.data)
      })
    }
  },
  getters: {
    //
  }
})

// export default useBloggerStore

/** 同一防抖函数被不同地方同时调用，只会接收最后一个 */
// const debounce2000A = _.debounce((func) => {
//   func()
// }, 2000)
// const debounce2000B = _.debounce((func) => {
//   func()
// }, 2000)
// const debounce2000C = _.debounce((func) => {
//   func()
// }, 2000)
