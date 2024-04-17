import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  Res,
  UploadedFile
} from '@nestjs/common'
import { UploadService } from './upload.service'
import { CreateUploadDto } from './dto/create-upload.dto'
import { UpdateUploadDto } from './dto/update-upload.dto'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import { extname } from 'path'

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(`/img`)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImg(@UploadedFile() file, @Req() req, @Res() res) {
    try {
      const filePath = await this.uploadService.uploadImage({
        sourcePath: file.path,
        extname: extname(file.originalname),
        dirname: req.user.UID
      })
      const path = 'http://' + req.headers.host + '/public' + filePath.split('public')[1] || ''
      // console.log(path)
      res.status(200).send(path)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }
}
