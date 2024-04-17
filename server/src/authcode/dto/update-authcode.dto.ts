import { PartialType } from '@nestjs/swagger'
import { CreateAuthcodeDto } from './create-authcode.dto'
import { ObjectId } from 'typeorm'

export class UpdateAuthcodeDto extends PartialType(CreateAuthcodeDto) {
  id: string
  name: string
  code: string
  desc: string
  disabled: boolean
}
