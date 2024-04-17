import { Injectable } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Product } from './entities/product.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { StorageService } from 'src/storage/storage.service'
import { AuthService } from 'src/auth/auth.service'
import { UserService } from 'src/user/user.service'
import { ObjectId } from 'mongodb'
import { GenProductDataDto } from './dto/gen-product-data-dto'
import { DirNameEnum, RemovedEnum } from 'src/enum'
import { ProductTypeEnum } from './enum/ProductTypeEnum'
import fs from 'fs'
import { ParseDto } from './dto/parse-product.dto'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: MongoRepository<Product>,
    private readonly userService: UserService,
    private readonly storageService: StorageService
  ) {}
  async create(createProductDto: CreateProductDto, userId: ObjectId, UID: string) {
    // const { isParsed, code, penname, email, blog, msg, type, title, content, abbrev,  } = createProductDto
    const product = this.genProductData({
      userId: userId,
      UID,
      ...createProductDto
    })
    const newProduct = await this.productsRepository.save(product)
    if (newProduct) return { createAt: newProduct.createAt }
    else throw new Error('创建产品失败')
  }

  /** 生成笔记产品数据 */
  genProductData(args: {
    userId: ObjectId
    UID: string
    type: ProductTypeEnum
    isParsed: boolean
    editorVersion: string
    authorizeId: ObjectId
    penname: string
    email: string
    blog: string
    abbrev: string
    msg: string

    title: string
    content: string
    audio: string
    duration: number
    promoterSequence: string[]
    keyframeSequence: number[]
    subtitleSequence: string[]
    subtitleKeyframeSequence: number[]
  }) {
    const {
      isParsed,
      editorVersion,
      penname,
      authorizeId,
      userId,
      UID,
      type,
      abbrev,
      msg,
      title,
      content,
      audio,
      duration,
      promoterSequence,
      keyframeSequence,
      subtitleSequence,
      subtitleKeyframeSequence
    } = args
    const product = new Product()
    product._id = new ObjectId()
    product.isParsed = isParsed
    product.editorVersion = editorVersion || ''
    product.penname = penname || ''
    product.authorizeId = authorizeId || null
    product.userId = userId
    product.UID = UID
    product.collectionId = null
    product.msg = msg
    product.abbrev = abbrev || ''
    product.tags = []
    product.type = type === 'note' ? ProductTypeEnum.NOTE : ProductTypeEnum.COURSE

    product.title = title
    product.content = content
    product.audio = audio
    product.duration = duration
    product.promoterSequence = promoterSequence
    product.keyframeSequence = keyframeSequence
    product.subtitleSequence = subtitleSequence
    product.subtitleKeyframeSequence = subtitleKeyframeSequence
    return product
  }

  async findAllUnfiled(userId: ObjectId) {
    const products = await this.productsRepository.find({
      where: { userId: userId, collectionId: null },
      select: [
        '_id',
        'isParsed',
        'authorizeId',
        'editorVersion',
        'penname',
        'title',
        'abbrev',
        // 'isPublish',
        'type',
        'createAt',
        'updateAt'
      ]
    })
    return products
  }

  findAll(collectionId: ObjectId, userId: ObjectId) {
    return this.productsRepository.find({ where: { collectionId, userId, removed: RemovedEnum.NEVER } })
  }

  async findOne(_id: ObjectId, userId: ObjectId, dirname: string) {
    try {
      const product = await this.productsRepository.findOneBy({ _id, userId })
      if (product.audio) {
        product.audio = this.storageService.getFilePath({
          filename: product.audio,
          dirname: dirname,
          category: 'audio'
        })
      }
      // const content = this.storageService.getTextFile(product.content)
      // product.content = content
      return product
    } catch (error) {
      throw error
    }
  }

  async findUnparseFile(filename: string, dirname: string) {
    const filepath = this.storageService.getFilePath({
      filename: filename,
      dirname: dirname,
      category: 'product',
      prv: true
    })
    const file = fs.readFileSync(filepath)
    return file
  }

  async parse(parseDto: ParseDto, userId: string) {
    // eslint-disable-next-line prettier/prettier
    const {
      id,
      firstPicture,
      content,
      duration,
      keyframeSequence,
      promoterSequence,
      subtitleKeyframeSequence,
      subtitleSequence
    } = parseDto
    const product = await this.productsRepository.findOneBy({ _id: new ObjectId(id), userId })
    product.firstPicture = firstPicture
    product.content = content
    product.abbrev = product.abbrev ? product.abbrev : content.replace(/<[^>]+>/g, '').slice(0, 100)
    product.duration = duration
    product.keyframeSequence = keyframeSequence
    product.promoterSequence = promoterSequence
    product.subtitleKeyframeSequence = subtitleKeyframeSequence
    product.subtitleSequence = subtitleSequence
    product.isParsed = true
    // const newProduct = product
    const newProduct = await this.productsRepository.save(product)
    // console.log(newProduct)
    if (newProduct) return newProduct
    else throw new Error('解析失败,项目id:' + id)
  }

  async allocation(_id: ObjectId, collectionId: ObjectId | null, isPublish: boolean, userId: ObjectId) {
    // TODO 这里应该对 collection 进行鉴权，否则有可能恶意将文件送入其它用户的合辑（当然，在查询product的时候也会进行userId鉴权，所以即便分配错误，也不会在其它用户的数据中显示出来。）
    const product = await this.productsRepository.findOneAndUpdate(
      { _id, userId },
      {
        $set: { collectionId, isPublish }
      }
    )
    if (product) return true
    else return false
  }

  async revoke(_id: ObjectId, userId: ObjectId) {
    const product = await this.productsRepository.findOneAndUpdate(
      { _id, userId },
      {
        $set: { collectionId: null }
      }
    )
    if (product) return true
    else return false
  }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} product`
  // }

  async count(collectionId: ObjectId) {
    const num = await this.productsRepository.count({ collectionId, removed: RemovedEnum.NEVER, isPublish: true })
    return num
  }
  /** ----------------------- 博客前端的服务 ------------------------- */
  async findOneToBlog(_id: ObjectId) {
    const product = await this.productsRepository.findOne({
      where: { _id, isPublish: true, removed: RemovedEnum.NEVER }
      // select: ['collectionId', 'penname', 'title', 'content', 'type', 'detail', 'createAt', 'updateAt']
    })
    if (product.audio) {
      product.audio = this.storageService.getFilePath({
        filename: product.audio,
        dirname: product.UID,
        category: 'audio'
      })
    }
    // console.log(product)
    // const content = this.storageService.getTextFile(product.content)
    // product.content = content
    return product
  }

  findListToBlog(UID: string, take: number, skip: number, collectionId?: string, type?: string) {
    const where: any = {
      UID,
      isPublish: true,
      removed: RemovedEnum.NEVER
    }
    if (collectionId && type) {
      where.collectionId = new ObjectId(collectionId)
      where.type = type
    } else if (collectionId) {
      where.collectionId = new ObjectId(collectionId)
    } else if (type) {
      where.type = type
    }
    return this.productsRepository.find({
      where: where,
      // eslint-disable-next-line prettier/prettier
      select: [
        '_id',
        'type',
        'collectionId',
        'penname',
        'email',
        'homepage',
        'firstPicture',
        'title',
        'abbrev',
        'createAt',
        'tags',
        'count'
      ],
      take: take,
      skip: skip
    })
  }

  findByCollectionToBlog(collectionId: ObjectId, take = 10, skip = 0) {
    return this.productsRepository.find({
      where: { collectionId, isPublish: true, removed: RemovedEnum.NEVER },
      skip,
      take
    })
  }
}
