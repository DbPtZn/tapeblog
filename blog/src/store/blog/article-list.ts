import { blogApi } from '@/api'
import { defineStore } from 'pinia'

export interface Count {
  like: number //点赞数
  comment: number // 评论数
  collection: number // 收藏数
  read: number // 阅读数
}

export interface ArticleItem {
  id: string
  type: 'course' | 'note'
  collectionId: string
  collectionName: string
  penname: string
  email: string
  homepage: string
  firstPicture: string
  title: string
  abbrev: string
  tags: string[]
  createAt: string
  count: Count
}

interface State {
  data: ArticleItem[]
}

export const useArticleListStore = defineStore('articleListStore', {
  state(): State  {
    return {
      data: []
    }
  },
  actions: {
    fetch(params: Parameters<typeof blogApi.article.getList>[0]) {
      return blogApi.article.getList<ArticleItem[]>(params)
    },
    set(data: ArticleItem[]) {
      // console.log(data)
      this.data.push(...data)
    },
    fetchAndSet(params: Parameters<typeof blogApi.article.getList>[0]) {
      return this.fetch(params).then((res) => {
        this.set(res.data)
      })
    }
  }
})
