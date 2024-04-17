import { Module } from '@nestjs/common'
import { UploadService } from './upload.service'
import { UploadController } from './upload.controller'
import { StorageModule } from 'src/storage/storage.module'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { join } from 'path'
const __rootdirname = process.cwd()
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__rootdirname, 'assets', 'images'),
        filename: (_, file, cb) => {
          // console.log(file)
          // const filename = `${new Date().getTime()}${extname(file.originalname)}`
          cb(null, file.originalname)
        }
      })
    }),
    StorageModule
  ],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
