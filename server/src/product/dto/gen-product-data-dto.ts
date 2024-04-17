import { ObjectId } from 'mongodb'
import { ProductTypeEnum } from '../enum/ProductTypeEnum'

export interface GenProductDataDto {
  penName: string
  author: string
  sourceId?: ObjectId
  type: ProductTypeEnum
  collectionId?: ObjectId
  account: string
  userId: ObjectId
  title: string
  content: string
  abbrev?: string
  msg?: string
}
