// import { blogApi } from '@/api'
import { defineStore } from 'pinia'
import _ from 'lodash'
import { blogApi } from '@/api'

export enum SortType {
  UPDATE = 'update',
  UPDATE_REVERSE = 'update_reverse',
  CREATE = 'create',
  CREATE_REVERSE = 'create_reverse',
  NAME = 'name',
  NAME_REVERSE = 'name_reverse'
}
export enum CollectionType {
  NOTE = 'note',
  COURSE = 'course'
}
export interface Product {
  id: string
  title: string
  abbrev: string
  type: CollectionType
  image: string
  // collectionId: string
  createAt: string
  updateAt: string
}

interface CollectionState {
  id: string
  name: string
  createAt: string
  updateAt: string
  subfiles: Product[]
}

export const useCollectionStore = defineStore('collectionBlogStore', {
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
    set(data: CollectionState) {
      this.$state = data
      console.log(this.$state)
    },
    fetch(id: string) {
      return blogApi.collection.get<CollectionState>(id)
    },
    fetchAndSet(id: string) {
      return this.fetch(id).then(res => this.set(res.data))
    }
  }
})
