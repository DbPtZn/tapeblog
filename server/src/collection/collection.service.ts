import { Injectable } from '@nestjs/common'
import { CreateCollectionDto } from './dto/create-collection.dto'
import { UpdateCollectionDto } from './dto/update-collection.dto'
import { Collection } from './entities/collection.entity'
import { ObjectId } from 'mongodb'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { RemovedEnum } from 'src/enum'
import { ProductService } from 'src/product/product.service'
@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collectionsRepository: MongoRepository<Collection>,
    private readonly productService: ProductService
  ) {}
  async create(createCollectionDto: CreateCollectionDto, userId: ObjectId, account: string, UID: string) {
    const { name } = createCollectionDto
    const collection = new Collection()
    collection.userId = userId
    collection.UID = UID
    collection.name = name
    collection.account = account
    collection.isPublish = false
    // console.log(collection)
    const newCollection = await this.collectionsRepository.save(collection)
    return newCollection
  }

  async findAll(userId: ObjectId) {
    const collections = await this.collectionsRepository.find({
      where: { userId: userId, removed: RemovedEnum.NEVER },
      select: ['_id', 'name', 'isPublish', 'createAt', 'updateAt']
    })
    // console.log(collections)
    return collections
  }

  async findOne(_id: ObjectId, userId: ObjectId) {
    const collection = await this.collectionsRepository.findOne({ where: { _id, userId, removed: RemovedEnum.NEVER } })
    return collection
  }

  /** 通过 id 获取合辑名称 */
  async getCollectionName(_id: ObjectId) {
    const collection = await this.collectionsRepository.findOne({
      where: { _id, removed: RemovedEnum.NEVER }
    })
    return collection && collection.name ? collection.name : null
  }

  async genCollectionData(_id: ObjectId, userId: ObjectId) {
    const collection = await this.findOne(_id, userId)
    const products = await this.productService.findAll(collection._id, userId)
    const subfiles = products.map(product => {
      return {
        id: product._id,
        isParsed: product.isParsed,
        authorizeId: product.authorizeId,
        penname: product.penname,
        title: product.title,
        abbrev: product.abbrev,
        type: product.type,
        isPublish: product.isPublish,
        collectionId: product.collectionId,
        createAt: product.createAt,
        updateAt: product.updateAt
      }
    })
    const collectionData = {
      id: collection._id,
      name: collection.name,
      isPublish: collection.isPublish,
      createAt: collection.createAt,
      updateAt: collection.updateAt,
      subfiles: subfiles
    }
    return collectionData
  }

  async findUnfiled(userId: ObjectId) {
    const products = await this.productService.findAllUnfiled(userId)
    // console.log(products)
    const subfiles = products.map(item => {
      return {
        id: item._id.toString(),
        title: item.title,
        abbrev: item.abbrev,
        type: item.type,
        // isPublish: item.isPublish,
        isParsed: item.isParsed,
        authorizeId: item.authorizeId,
        penname: item.penname,
        editorVersion: item.editorVersion,
        createAt: item.createAt,
        updateAt: item.updateAt
      }
    })
    const unfiled = {
      id: 'unfiled',
      name: '待分配',
      isPublish: false,
      createAt: '',
      updateAt: '',
      subfiles: subfiles
    }
    return unfiled
  }

  async publish(_id: ObjectId, userId: ObjectId) {
    const collection = await this.collectionsRepository.findOneBy({ _id, userId })
    collection.isPublish = !collection.isPublish
    return this.collectionsRepository.save(collection)
  }

  async rename(_id: ObjectId, newname: string, userId: ObjectId) {
    const collection = await this.collectionsRepository.findOneBy({ _id, userId })
    collection.name = newname
    return this.collectionsRepository.save(collection)
  }

  async remove(_id: ObjectId, userId: ObjectId) {
    const collection = await this.collectionsRepository.findOneBy({ _id, userId })
    collection.removed = RemovedEnum.ACTIVE
    return this.collectionsRepository.save(collection)
  }

  async restore(_id: ObjectId, userId: ObjectId) {
    const collection = await this.collectionsRepository.findOneBy({ _id, userId })
    collection.removed = RemovedEnum.NEVER
    return this.collectionsRepository.save(collection)
  }

  async delete(_id: ObjectId, userId: ObjectId, UID: string) {
    // try {
    //   const folder = await this.collectionsRepository.findOneBy({ _id, userId })
    //   const result = await this.collectionsRepository.remove(folder)
    //   // 注意，删除成功后， folder._id 和 result._id 都会是 undefined
    //   // 删除文件夹下的所有文件(不包括其子文件夹,也不包括其中已被移除的文件)
    //   const projects = await this.productService.findAllByFolderId(_id, userId)
    //   projects.forEach(async project => {
    //     await this.productService.delete(project._id, userId, UID)
    //   })
    // } catch (error) {
    //   throw error
    // }
  }

  /** 博客公开查询 */
  async findPublished(UID: string) {
    const collections = await this.collectionsRepository.find({
      where: { UID, isPublish: true }
    })
    return collections
  }

  async genCollectionDataToBlog(UID: string) {
    const collection = await this.collectionsRepository.findOne({
      where: { UID, isPublish: true }
    })
    if (!collection) throw '查询不到对应合辑！该合辑可能不存在或未公开'
    const products = await this.productService.findByCollectionToBlog(collection._id)
    const subfiles = products.map(product => {
      return {
        id: product._id,
        title: product.title,
        abbrev: product.abbrev,
        type: product.type,
        createAt: product.createAt,
        updateAt: product.updateAt
      }
    })
    const collectionData = {
      id: collection._id,
      name: collection.name,
      createAt: collection.createAt,
      updateAt: collection.updateAt,
      subfiles: subfiles
    }
    return collectionData
  }

  async findCollectionListToBlog(UID: string) {
    const collections = await this.collectionsRepository.find({
      where: { UID, isPublish: true },
      select: ['_id', 'UID', 'name', 'updateAt', 'createAt']
    })
    return collections
  }
}
