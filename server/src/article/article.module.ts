import { Module } from '@nestjs/common'
import { ArticleService } from './article.service'
import { ArticleController } from './article.controller'
import { ProductModule } from 'src/product/product.module'
import { CollectionModule } from 'src/collection/collection.module'

@Module({
  imports: [ProductModule],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticleModule {}
