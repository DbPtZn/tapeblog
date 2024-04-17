import { IsString } from 'class-validator'
import { ProductTypeEnum } from 'src/product/enum/ProductTypeEnum'

export class ReceiveProductDto {
  // 编辑器版本号
  editorVersion?: string
  // 笔名
  // @IsString()
  penname?: string

  // @IsString()
  code?: string

  // 邮箱
  // @IsString()
  email?: string

  // @IsString()
  blog?: string

  // 附加信息(在未分配时显示，分配后清除)
  // @IsString()
  msg?: string

  // 作品的类型
  // @IsString()
  type: ProductTypeEnum

  // 标题
  // @IsString()
  title: string

  // 缩略
  // @IsString()
  abbrev?: string
}
