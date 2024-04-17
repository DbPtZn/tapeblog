import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipe
} from '@nestjs/common'
import { ReceiverService } from './receiver.service'
import { ReceiveProductDto } from './dto/receive.dto'
import { FileInterceptor, FilesInterceptor, AnyFilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express'
// import { CreateReceiverDto } from './dto/receive.dto';
// import { UpdateReceiverDto } from './dto/update-receiver.dto';

@Controller('receiver')
export class ReceiverController {
  constructor(private readonly receiverService: ReceiverService) {}

  @Post('/:account')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'jsonDocs', maxCount: 1 },
      { name: 'audios', maxCount: 1 }
    ])
  )
  async receive(
    @Param('account') account: string,
    // @UploadedFiles() files: any[],
    @UploadedFiles(
      new ParseFilePipe({
        exceptionFactory(error) {
          console.log(error)
        }
      })
    )
    files: { jsonDocs: Express.Multer.File[]; audios: Express.Multer.File[] },
    @Body() formdata: any,
    @Req() req,
    @Res() res
  ) {
    // console.log(files)
    // console.log(document)
    // const { document, audio } = files
    this.receiverService
      .receive(formdata, files, account)
      .then(result => {
        // 因为当前客户端会根据 code 进行全局处理，401 可能导致用户退出登录，待优化
        switch (result.code) {
          case 401:
            return res.status(400).send(result)
          case 403:
            return res.status(400).send(result)
          case 201:
            return res.status(200).send(result)
        }
      })
      .catch(err => {
        console.log(err)
        res.status(400).send(err)
      })
  }
}
