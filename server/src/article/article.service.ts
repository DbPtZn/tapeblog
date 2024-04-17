import { Injectable } from '@nestjs/common'
import { ObjectId } from 'mongodb'
import { CollectionModule } from 'src/collection/collection.module'
import { ProductService } from 'src/product/product.service'

@Injectable()
export class ArticleService {
  constructor(private readonly productService: ProductService) {}

  findProduct(_id: ObjectId) {
    // this.productService.findOne(_id)
  }
}
