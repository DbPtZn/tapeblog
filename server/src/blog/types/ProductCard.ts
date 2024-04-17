import { ObjectId } from 'mongodb'

interface Count {
  like: number //点赞数
  comment: number // 评论数
  collection: number // 收藏数
  read: number // 阅读数
}

export interface ProductCard {
  id: ObjectId
  collectionId: ObjectId
  collectionName: string
  penname: string
  firstPicture: string
  title: string
  abbrev: string
  createAt: Date
  count: Count
}
