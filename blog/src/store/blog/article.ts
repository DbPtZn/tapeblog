import { blogApi } from '@/api'
import { defineStore } from 'pinia'
import _ from 'lodash'
import router from '@/router'
import { EditorWidthEnum, ProductTypeEnum, RouteNameEnum } from '@/enums'
export interface Article {
  id: string
  UID: string
  collectionId: string
  editorVersion: string
  type: ProductTypeEnum | undefined

  penname: string
  email: string
  blog: string

  detail: {
    wordage: number // 字数
    duration?: number // 时长
    filesize?: number // 文件大小(包含音频文件、文本、图片)
  }

  count: {
    like: number //点赞数
    comment: number // 评论数
    collection: number // 收藏数
    read: number // 阅读数
  }

  createAt: string
  updateAt: string

  title: string
  content: string
  audio: string
  duration: number
  promoterSequence: string[]
  keyframeSequence: number[]
  subtitleSequence: string[]
  subtitleKeyframeSequence: number[]
}

interface State {
  data: Article[]
}
export const useArticleStore = defineStore('articleStore', {
  state(): State {
    return {
      data: []
    }
  },
  actions: {
    fetchAndSet(id: string) {
      return new Promise<Article>((resolve, reject) => {
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
      return blogApi.article.get(id)
    },
    set(data: any) {
      const state: Article = {
        id: data._id || '',
        UID: data.UID || '',
        collectionId: data.collectionId || '',
        editorVersion: data.editorVersion || '',
        type: data.type || undefined,

        penname: data.penname || '',
        email: data.email || '',
        blog: data.blog || '',

        detail: {
          wordage: data.wordCount || 0,
          duration: data.duration || 0,
          filesize: data.filesize || 0
        },

        count: {
          like: data.like || 0,
          comment: data.comment || 0,
          collection: data.collection || 0,
          read: data.read || 0
        },

        createAt: data.createAt || '',
        updateAt: data.updateAt || '',

        title: data.title || '',
        content: data.content || '',

        audio: data.audio || '',
        duration: data.duration || 0,
        promoterSequence: data.promoterSequence || [],
        keyframeSequence: data.keyframeSequence || [],
        subtitleSequence: data.subtitleSequence || [],
        subtitleKeyframeSequence: data.subtitleKeyframeSequence || []
      }
      this.data.push(state)
      return state
    },
    get(id: string) {
      const index = this.data.findIndex(i => i.id === id)
      if (index !== -1) return this.data[index]
      return {
        id: '',
        UID: '',
        collectionId: '',
        editorVersion: '',
        type: undefined,

        penname: '',
        email: '',
        blog: '',

        detail: {
          wordage: 0,
          duration: 0,
          filesize: 0
        },

        count: {
          like: 0,
          comment: 0,
          collection: 0,
          read: 0
        },
        createAt: '',
        updateAt: '',

        title: '',
        content: '',
        audio: '',
        duration: 0,
        promoterSequence: [],
        keyframeSequence: [],
        subtitleSequence: [],
        subtitleKeyframeSequence: []
      }
    }
  }
})
