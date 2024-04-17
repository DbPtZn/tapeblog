import { Module, forwardRef } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { StorageModule } from 'src/storage/storage.module'
import { BcryptModule } from 'src/bcrypt/bcrypt.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), BcryptModule, StorageModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
