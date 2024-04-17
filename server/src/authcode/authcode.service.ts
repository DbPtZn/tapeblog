import { Injectable } from '@nestjs/common'
import { CreateAuthcodeDto } from './dto/create-authcode.dto'
import { UpdateAuthcodeDto } from './dto/update-authcode.dto'
import { Authcode } from './entities/authcode.entity'
import { MongoRepository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectId } from 'mongodb'

@Injectable()
export class AuthcodeService {
  constructor(
    @InjectRepository(Authcode)
    private authcodeRepository: MongoRepository<Authcode>
  ) {}
  async validateCode(code: string, userId: ObjectId) {
    const authcode = await this.authcodeRepository.findOneBy({
      where: { userId, code, disabled: false }
    })
    return authcode
  }

  async add(userId: ObjectId) {
    // const { name, code, desc } = createAuthcodeDto
    // const isExist = await this.authcodeRepository.existsBy({ userId, code })
    // if (isExist) throw { msg: '该授权码已存在！' }
    const authcode = new Authcode()
    authcode._id = new ObjectId()
    authcode.userId = userId
    authcode.name = ''
    authcode.code = ''
    authcode.desc = ''
    return this.authcodeRepository.save(authcode)
  }

  async findAll(userId: ObjectId) {
    const authcodes = await this.authcodeRepository.find({
      where: { userId }
    })
    return authcodes
  }

  async findOne(_id: ObjectId, userId: ObjectId) {
    const authcode = await this.authcodeRepository.findOneBy({ _id, userId })
    return authcode
  }

  async update(updateAuthcodeDto: UpdateAuthcodeDto, userId: ObjectId) {
    const { id, name, code, desc, disabled } = updateAuthcodeDto
    // const isExist = await this.authcodeRepository.findOneBy({ userId, code })
    // if (isExist && isExist._id.toHexString() !== id) throw new Error('该授权码已存在！')
    const authcode = await this.authcodeRepository.findOneBy({ _id: new ObjectId(id), userId })
    authcode.name = name
    authcode.code = code
    authcode.desc = desc
    authcode.disabled = disabled
    const newCode = await this.authcodeRepository.save(authcode)
    if (newCode) return newCode
    else throw new Error('更新失败')
  }

  async remove(_id: ObjectId, userId: ObjectId) {
    const result = await this.authcodeRepository.delete({ _id, userId })
    if (result.affected === 0) throw new Error('删除失败：未能找到对象，可能已经被彻底删除！')
    return { msg: '删除成功！', date: new Date() }
  }
}
