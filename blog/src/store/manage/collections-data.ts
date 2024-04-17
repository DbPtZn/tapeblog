// import { manageApi } from '@/api'
import { defineStore } from 'pinia'
import _ from 'lodash'
import { LibraryEnum } from '@/enums'
import { TreeOption } from 'naive-ui'
import { manageApi } from '@/api'

export interface Collection {
  id: string
  name: string
  isPublish: boolean
  updateAt?: string
  createAt?: string
}
interface State {
  data: Collection[]
}
export const useCollectionsDataStore = defineStore('collectionsDataStore', {
  state(): State  {
    return {
      data: []
    }
  },
  actions: {
    fetchAndSet() {
      return this.fetch().then(res => this.set(res.data))
      // return manageApi.collection.getAll<Collection[]>().then(res => this.set(res.data))
    },
    fetch() {
      return manageApi.collection.getAll<Collection[]>()
    },
    set(data: Collection[]) {
      this.data = data
    },
    get() {
      return this.data
    }
  }
})
