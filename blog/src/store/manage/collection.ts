// import { manageApi } from '@/api'
import { defineStore } from 'pinia'
import _ from 'lodash'
import { LibraryEnum } from '@/enums'
import { TreeOption } from 'naive-ui'
import { manageApi } from '@/api'

// export enum SortType {
//   UPDATE = 'update',
//   UPDATE_REVERSE = 'update_reverse',
//   CREATE = 'create',
//   CREATE_REVERSE = 'create_reverse',
//   NAME = 'name',
//   NAME_REVERSE = 'name_reverse'
// }
// export enum CollectionType {
//   NOTE = 'note',
//   COURSE = 'course'
// }
export interface article {
  id: string
  penname: string
  title: string
  abbrev: string
  type: string
  isPublish: boolean
  isParsed: boolean
  collectionId: string
  authorizeId: string
  editorVersion: string
  createAt: string
  updateAt: string
}

interface CollectionState {
  id: string
  name: string
  createAt: string
  updateAt: string
  subfiles: article[]
}

export const useCollectionStore = defineStore('collectionStore', {
  state(): CollectionState {
    return {
      id: '',
      name: '',
      createAt: '',
      updateAt: '',
      subfiles: []
    }
  },
  actions: {
    create(params: Parameters<typeof manageApi.collection.create>[0]) {
      return manageApi.collection.create<CollectionState>(params).then(res => {
        this.set(res.data)
      })
    },
    set(data: CollectionState) {
      console.log(data)
      this.$state = data
    },
    fetch(id: string) {
      return manageApi.collection.get<CollectionState>(id)
    },
    fetchAndSet(id: string) {
      this.fetch(id).then(res => this.set(res.data))
    },
    fetchUnfiled() {
      return manageApi.collection.getUnfiled<CollectionState>()
    },
    /** 获取并设置未分配文档数据 */
    fetchUnfiledAndSet() {
      return this.fetchUnfiled().then(res => {
        this.set(res.data)
      })
    },
    removeSubfileById(id: string) {
      const files = this.subfiles?.splice(this.subfiles.findIndex(item => item.id === id), 1)
      console.log(this.subfiles)
      return files && files[0]
    },
  }
})
