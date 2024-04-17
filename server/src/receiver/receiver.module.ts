import { Module } from '@nestjs/common'
import { ReceiverService } from './receiver.service'
import { ReceiverController } from './receiver.controller'
import { UserModule } from 'src/user/user.module'
import { ProductModule } from 'src/product/product.module'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { StorageModule } from 'src/storage/storage.module'
import { AuthcodeModule } from 'src/authcode/authcode.module'
import * as randomstring from 'randomstring'
const __rootdirname = process.cwd()
@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: join(__rootdirname, 'private', 'unparsed'),
          filename: (_, file, cb) => {
            // console.log(_.files)
            // console.log(_.fields)
            // console.log(_.body)
            // console.log(_.baseUrl)
            // // console.log(_.ip)
            // console.log(extname(file.mimetype))
            // console.log('storage')
            // console.log(file)
            const filename = `${randomstring.generate(3)}${new Date().getTime()}${extname(file.originalname)}`
            cb(null, filename)
          }
        })
      })
    }),
    UserModule,
    ProductModule,
    StorageModule,
    AuthcodeModule
  ],
  controllers: [ReceiverController],
  providers: [ReceiverService]
})
export class ReceiverModule {}
