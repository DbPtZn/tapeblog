import { blogApi } from '@/api'
import { defineStore } from 'pinia'

interface Blogger {
  account: string
  nickname?: string
  desc?: string
  createAt?: string
  avatar?: string
}

interface State {
  data: Blogger[]
}

export const useBolggerListStore = defineStore('bolggerListStore', {
  state(): State  {
    return {
      data: []
    }
  },
  actions: {
    /** 获取博主数据 */
    fetchAndSet(params: Parameters<typeof blogApi.blogger.get>[0]) {
      return blogApi.blogger.get<Blogger[]>(params).then((res) => {
        res.data.forEach((item) => {
          this.data.unshift(item)
        })
      })
    },
    // /** 获取博主信息 */
    // fetch_Info(account: string, index?: number) {
    //   return blogApi.blogger.getInfo(account).then(res => {
    //     this.set(res.data, index)
    //   })
    // },
    // set(data: Blogger, index?: number) {
    //   if(index !== undefined) {
    //     this.data[index] = data
    //   } else {
    //     this.data[this.data.findIndex(item => item.account === data.account)] = data
    //   }
    // }
  }
})
