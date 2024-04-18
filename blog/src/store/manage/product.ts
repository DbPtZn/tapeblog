import { manageApi } from '@/api'
import { defineStore } from 'pinia'
import _ from 'lodash'
import router from '@/router'
import { EditorWidthEnum, ProductTypeEnum } from '@/enums'
interface UnparsedData {
  title: string
  content: string
  duration: number
  promoterSequence: string[]
  keyframeSequence: number[]
  subtitleSequence: string[]
  subtitleKeyframeSequence: number[]
}
export interface Product {
  isParsed: boolean
  editorVersion: string
  collectionId: string
  authorizeId: string
  type: ProductTypeEnum | undefined,
  id: string

  title: string
  content: string
  audio: string
  duration: number
  promoterSequence: string[]
  keyframeSequence: number[]
  subtitleSequence: string[]
  subtitleKeyframeSequence: number[]

  penname: string
  email: string
  homepage: string
  detial: { wordage: number; filesize: number; duration: number, audiosize: number }
  msg: string
  createAt: string
  updateAt: string
  setting?: {
    editorWidth?: number | string
  }
}
interface State {
  data: Product[]
}

export const useProductStore = defineStore('productStore', {
  state(): State {
    return {
      data: []
    }
  },
  actions: {
    fetchAndSet(id: string) {
      return new Promise<Product>((resolve, reject) => {
        const index = this.data.findIndex(i => i.id === id)
        if (index !== -1) {
          resolve(this.data[index])
        } else {
          this.fetch(id)
            .then(res => {
              const newItem = this.set(res.data)
              resolve(newItem)
            })
            .catch(err => {
              reject(err)
            })
        }
      })
    },
    fetch(id: string) {
      return manageApi.product.get(id)
    },
    set(data: any) {
      const newItem: Product = {
        isParsed: data.isParsed || false,
        editorVersion: data.editorVersion || '',
        authorizeId: data.authorizeId || '',
        collectionId: data.collectionId || '',
        type: data.type || undefined,

        id: data._id || '',
        title: data.title || '',
        content: data.content || '',
        audio: data.audio || '',
        duration: data.duration || 0,
        promoterSequence: data.promoterSequence || [],
        keyframeSequence: data.keyframeSequence || [],
        subtitleSequence: data.subtitleSequence || [],
        subtitleKeyframeSequence: data.subtitleKeyframeSequence || [],

        penname: data.penname || '',
        email: data.email || '',
        homepage: data.email || '',
        createAt: data.createAt || '',
        updateAt: data.updateAt || '',
        msg: data.msg || '',
        detial: data.detial || { wordage: 0, filesize: 0, duration: 0, audiosize: 0 },
        setting: {
          editorWidth: EditorWidthEnum.SM
        }
      }
      this.data.push(newItem)
      return newItem
    },
    get(id: string) {
      const index = this.data.findIndex(i => i.id === id)
      if (index !== -1) return this.data[index]
      return null
      // return { title: '', content: '', type: undefined, collectionId: '', penname: '', email: '', homepage: '', createAt: '', updateAt: '', detial: { wordage: 0, filesize: 0, duration: 0, audiosize: 0 } }
    },
    fetchUnparsedFile(filename: string, progressCallback?: (progressEvent: number) => void) {
      return manageApi.product.getUnparsedFile<UnparsedData>(filename, progressCallback)
    },
    /** 解析 */
    parse(dto: Parameters<typeof manageApi.product.parse>[0]) {
      return manageApi.product.parse<Product>(dto).then(res => {
        // 解析成功后，用新数据替换旧数据
        const index = this.data.findIndex(i => i.id === dto.id)
        if (index !== -1)  this.data[index] = res.data
      })
    },
    /** 分配 */
    allocation(dto: Parameters<typeof manageApi.product.allocation>[0]) {
      return manageApi.product.allocation(dto)
    },
    publish(id: string) {
      return manageApi.product.publish<boolean>(id)
    },
    updateTitle(id: string, newTitle: string) {
      return manageApi.product.updateTitle({ id, title: newTitle }).then(res => {
        const index = this.data.findIndex(i => i.id === id)
        if (index !== -1) this.data[index].title = newTitle
      })
    },
    revoke(id: string) {
      return manageApi.product.revoke(id)
    },
    remove(id: string) {
      return manageApi.product.remove(id)
    },
    restore(id: string) {
      return manageApi.product.restore(id)
    },
    delete(id: string) {
      return manageApi.product.delete(id)
    },
    // move(id: string, folderId: string) {
    //   // return manageApi.product.move(id, folderId)
    // },
    // copy(id: string, folderId: string) {
    //   // return manageApi.product.copy(id, folderId)
    // }
  }
})

