import { Module } from '@nestjs/common'
import { CollectionService } from './collection.service'
import { CollectionController } from './collection.controller'
import { Collection } from './entities/collection.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductModule } from 'src/product/product.module'

@Module({
  imports: [TypeOrmModule.forFeature([Collection]), ProductModule],
  controllers: [CollectionController],
  providers: [CollectionService],
  exports: [CollectionService]
})
export class CollectionModule {}
