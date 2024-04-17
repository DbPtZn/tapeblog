import { defineStore } from 'pinia'
import { blogApi } from '@/api'

export interface CollectionItem {
  id: string
  UID: string
  name: string
  quantity: number
  createdAt: string
  updatedAt: string
}

interface State {
  data: CollectionItem[]
}

export const useCollectionListStore = defineStore('collectionListStore', {
  state(): State  {
    return {
      data: []
    }
  },
  actions: {
    /** 获取列表数据 */
    fetchAndSet(UID: string) {
      if(this.data.length > 0) return
      return blogApi.collection.getList<CollectionItem[]>(UID).then((res) => {
        this.$patch((state) => {
          state.data = res.data
        })
      })
    }
  }
})
