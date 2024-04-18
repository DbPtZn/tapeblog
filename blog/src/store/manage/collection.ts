// import { manageApi } from '@/api'
import { defineStore } from 'pinia'
import _ from 'lodash'
import { LibraryEnum } from '@/enums'
import { TreeOption } from 'naive-ui'
import { manageApi } from '@/api'
import { SortType } from './_types'
interface Article {
  id: string
  penname: string
  title: string
  abbrev: string
  type: 'note' | 'course'
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
  subfiles: Article[]
}

export const useCollectionStore = defineStore('collectionManageStore', {
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
      // console.log(data)
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
      const files = this.subfiles?.splice(
        this.subfiles.findIndex(item => item.id === id),
        1
      )
      // console.log(this.subfiles)
      return files && files[0]
    },
    getSubfiles(sortType?: SortType) {
      switch (sortType) {
        case SortType.UPDATE:
          return this.getSubfilesSortUpdateAt
        case SortType.NAME:
          return this.getSubfilesSortByName
        case SortType.CREATE:
          return this.getSubfilesSortByCreateAt
        case SortType.UPDATE_REVERSE:
          return this.getSubfilesSortUpdateAtReverse
        case SortType.NAME_REVERSE:
          return this.getSubfilesSortByNameReverse
        case SortType.CREATE_REVERSE:
          return this.getSubfilesSortByCreateAtReverse
        default:
          return this.getSubfilesSortUpdateAt
      }
    },
  },
  getters: {
    getSubfilesSortByName(): Article[] {
      return this.subfiles ? _.sortBy(this.subfiles, item => item.title) : []
    },
    getSubfilesSortUpdateAt(): Article[] {
      return this.subfiles ? _.sortBy(this.subfiles, item => new Date(item.updateAt)) : []
    },
    getSubfilesSortByCreateAt(): Article[] {
      return this.subfiles ? _.sortBy(this.subfiles, item => new Date(item.createAt)) : []
    },
    // reverse
    getSubfilesSortByNameReverse(): Article[] {
      return this.subfiles ? _.sortBy(this.subfiles, item => item.title).reverse() : []
    },
    getSubfilesSortUpdateAtReverse(): Article[] {
      return this.subfiles ? _.sortBy(this.subfiles, item => new Date(item.updateAt)).reverse() : []
    },
    getSubfilesSortByCreateAtReverse(): Article[] {
      return this.subfiles ? _.sortBy(this.subfiles, item => new Date(item.createAt)).reverse() : []
    }
  }
})
