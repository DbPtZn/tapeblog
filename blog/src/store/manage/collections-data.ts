// import { manageApi } from '@/api'
import { defineStore } from 'pinia'
import _ from 'lodash'
import { LibraryEnum } from '@/enums'
import { TreeOption } from 'naive-ui'
import { manageApi } from '@/api'

interface Collection {
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
    get(id) {
      return this.data.find(item => item.id === id)
    },
    publish(id: string) {
      return manageApi.collection.publish<boolean>(id).then(res => {
        const isPubilsh = res.data
        this.data.some((item, index, arr) => {
          if (item.id === id) {
            arr[index].isPublish = isPubilsh
            return true
          }
        })
      })
    },
    remove(id: string) {
      return manageApi.collection.remove(id).then(res => {
        const index = this.data.findIndex(item => item.id === id)
        if (index !== -1) {
          this.data.splice(index, 1)
        }
      })
    },
    rename(id: string, newname: string) {
      return manageApi.collection.rename(id, newname).then(res => {
        this.data.some((item, index, arr) => {
          if (item.id === id) {
            arr[index].name = newname
            return true
          }
        })
      })
    },
    restore(id: string) {
      return manageApi.collection.restore(id).then(res => {
        // this.data.push(res.data)
      })
    },
    delete(id: string) {
      return manageApi.collection.delete(id)
    },
    move() {
      // return manageApi.collection.move()
    }
  }
})
