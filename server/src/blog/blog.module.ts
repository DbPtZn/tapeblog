import { Module } from '@nestjs/common'
import { BlogService } from './blog.service'
import { BlogController } from './blog.controller'
import { ProductModule } from 'src/product/product.module'
import { CollectionModule } from 'src/collection/collection.module'
import { ApiModule } from 'src/api/api.module'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [UserModule, ProductModule, CollectionModule, ApiModule],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule {}
