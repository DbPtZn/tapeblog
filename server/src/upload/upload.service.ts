import { Injectable } from '@nestjs/common'
import { CreateUploadDto } from './dto/create-upload.dto'
import { UpdateUploadDto } from './dto/update-upload.dto'
import { StorageService } from 'src/storage/storage.service'

@Injectable()
export class UploadService {
  constructor(private readonly storageService: StorageService) {}
  uploadImage(args: { sourcePath: string; extname: string; dirname: string }) {
    return this.storageService.saveImage(args)
  }
}
