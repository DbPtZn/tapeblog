import { Injectable } from '@nestjs/common'
import { ReceiveProductDto } from './dto/receive.dto'
import { UserService } from 'src/user/user.service'
import { ProductService } from 'src/product/product.service'
import { StorageService } from 'src/storage/storage.service'
import { extname } from 'path'
import * as fs from 'fs'
import { AuthcodeService } from 'src/authcode/authcode.service'
import { Authcode } from 'src/authcode/entities/authcode.entity'

@Injectable()
export class ReceiverService {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly authcodeService: AuthcodeService,
    private readonly storageService: StorageService
  ) {}

  async receive(
    dto: ReceiveProductDto,
    files: { jsonDocs: Express.Multer.File[]; audios: Express.Multer.File[] },
    account: string
  ) {
    const { jsonDocs, audios } = files
    const jsonDoc = jsonDocs ? jsonDocs[0] : undefined
    const audio = audios ? audios[0] : undefined

    const data = {
      // 产品信息
      isParsed: false,
      editorVersion: dto.editorVersion || '1.0.0',
      type: dto.type,
      authorizeId: null,
      penname: dto.penname || '',
      email: dto.email || '',
      blog: dto.blog || '',
      msg: dto.msg || '',
      abbrev: dto.abbrev,
      // 产品内容
      title: dto.title,
      content: '',
      audio: '',
      duration: 0,
      promoterSequence: [],
      keyframeSequence: [],
      subtitleSequence: [],
      subtitleKeyframeSequence: []
    }

    const user = await this.userService.findOneByAccount(account)
    /** 授权码验证 */
    if (user.receiverConfig.status === 2) {
      fs.unlinkSync(jsonDoc.path)
      fs.unlinkSync(audio.path)
      return { code: 403, msg: '收稿人拒绝任何投稿！' }
    }
    // console.log(user.receiverConfig.status, dto.code)
    if (user.receiverConfig.status === 1 && dto.code) {
      const authcode = await this.authcodeService.validateCode(dto.code, user._id)
      if (!authcode) {
        fs.unlinkSync(jsonDoc.path)
        fs.unlinkSync(audio.path)
        return { code: 401, msg: '授权码验证失败！' }
      }
      data.authorizeId = authcode._id
    }

    /** 数据文档 */
    const { filepath: docpath, filename: docname } = this.storageService.createFilePath({
      dirname: user.UID,
      category: 'product',
      originalname: jsonDoc.filename,
      extname: '',
      prv: true
    })
    fs.renameSync(jsonDoc.path, docpath)

    data.content = docname
    /** 处理音频文件 */
    if (audio) {
      const { filepath: audiopath, filename: audioname } = this.storageService.createFilePath({
        dirname: user.UID,
        category: 'audio',
        originalname: audio.filename,
        extname: '',
        prv: false
      })
      fs.renameSync(audio.path, audiopath)
      data.audio = audioname
    }
    // console.log(data)
    // console.log(data.keyframeSequence)
    const result = await this.productService.create(
      {
        ...data
      },
      user._id,
      user.UID
    )
    return { code: 201, msg: '投稿成功！' }
  }

  reject() {}
}

// 目前编辑器无法在服务端渲染实例，
// const isParsed = user.receiverConfig ? user.receiverConfig.autoParse : false
// const isParsed = true
// if (isParsed) {
//   // 将 json 文件解析出来
//   const str = fs.readFileSync(docpath, 'utf8')
//   const doc = JSON.parse(str)
//   // console.log(doc)
//   // console.log(doc.content.length)
//   // const content = await this.editorService.convert(doc.content, user.dirname)
//   data.content = doc.content
//   data.duration = Number(doc.duration)
//   data.promoterSequence = doc.promoterSequence || []
//   data.keyframeSequence = doc.keyframeSequence || []
//   data.subtitleSequence = doc.subtitleSequence || []
//   data.subtitleKeyframeSequence = doc.subtitleKeyframeSequence || []
//   fs.unlinkSync(docpath) // 确认解析完成后移除 JSON 文件
// }
