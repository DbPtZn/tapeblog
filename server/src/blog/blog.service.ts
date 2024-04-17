import { Injectable } from '@nestjs/common'
import { CreateBlogDto } from './dto/create-blog.dto'
import { UpdateBlogDto } from './dto/update-blog.dto'
import { ProductService } from 'src/product/product.service'
import { CollectionService } from 'src/collection/collection.service'
import { ObjectId } from 'mongodb'
import { ProductCard } from './types/ProductCard'
import { ApiService } from 'src/api/api.service'
import { UserService } from 'src/user/user.service'

@Injectable()
export class BlogService {
  constructor(
    private readonly userService: UserService,
    private readonly collectionService: CollectionService,
    private readonly productService: ProductService,
    private readonly ApiService: ApiService
  ) {}
  /** 查询博主 */
  async findBlogger(UID: string) {
    const user = await this.userService.getBlogger(UID)
    return user
  }

  /** 查询作品 */
  async findProduct(id: string) {
    const product = await this.productService.findOneToBlog(new ObjectId(id))
    // product.content = this.ApiService.zhToMartian(product.content)
    return product
  }

  /** 查询作品列表 */
  async findProductList(UID: string, take: number, skip: number, collectionId?: string, type?: string) {
    // console.log([UID, take, skip])
    const products = await this.productService.findListToBlog(UID, take, skip, collectionId, type)
    // console.log(products)
    const data: ProductCard[] = products.map(product => {
      return {
        id: product._id,
        type: product.type,
        collectionId: product.collectionId,
        collectionName: '',
        penname: product.penname,
        email: product.email,
        homepage: product.homepage,
        firstPicture: product.firstPicture,
        title: product.title,
        abbrev: product.abbrev,
        tags: product.tags,
        createAt: product.createAt,
        count: product.count
      }
    })
    const promiseArr = data.map(item => {
      return this.collectionService.getCollectionName(item.collectionId)
    })
    await Promise.all(promiseArr).then(collectionNames => {
      data.forEach((item, index, arr) => {
        arr[index].collectionName = collectionNames[index]
      })
    })
    return data
  }

  /** 查询合辑 */
  async findCollectionList(UID: string) {
    const collection = await this.collectionService.findCollectionListToBlog(UID)
    const data = collection.map(item => {
      return {
        id: item._id,
        UID: item.UID,
        name: item.name,
        quantity: 0,
        updateAt: item.updateAt,
        createAt: item.createAt
      }
    })
    const promiseArr = data.map(item => {
      return this.productService.count(item.id)
    })
    await Promise.all(promiseArr).then(counts => {
      data.forEach((item, index, arr) => {
        arr[index].quantity = counts[index]
      })
    })
    return data
  }
}
