import { Module } from '@nestjs/common'
import { StorageService } from './storage.service'
import { StorageController } from './storage.controller'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
// import { ServeStaticModule } from '@nestjs/serve-static'
@Module({
  imports: [
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: join(__dirname, '../../', 'assets', 'images'),
    //     filename: (_, file, cb) => {
    //       // console.log(file)
    //       // const filename = `${new Date().getTime()}${extname(file.originalname)}`
    //       cb(null, file.originalname)
    //     }
    //   })
    // })
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads') // 你的文件存储目录
    // })
  ],
  providers: [StorageService],
  exports: [StorageService],
  controllers: [StorageController]
})
export class StorageModule {}
