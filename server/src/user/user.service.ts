import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { MongoRepository } from 'typeorm'
import { ObjectId } from 'mongodb'
import { StorageService } from 'src/storage/storage.service'
import * as path from 'path'
import * as fs from 'fs'
import { BcryptService } from 'src/bcrypt/bcrypt.service'
// import * as UUID from 'uuid'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: MongoRepository<User>,
    private readonly bcrtptService: BcryptService,
    private readonly storageService: StorageService
  ) {}

  /** 创建新用户 */
  async create(createUserDto: CreateUserDto) {
    // 获取注册信息
    const { account, password, nickname } = createUserDto
    // console.log(createUserDto)
    const isValid = /^[a-zA-Z0-9@.]+$/.test(account)
    if (!isValid) throw '账号名称包含非法字符！'
    if (password.includes(' ')) throw '密码中不能包含空格！'

    // 判断该用户是否存在
    const isUserExist = await this.findOneByAccount(account)
    if (isUserExist) {
      throw new Error('该账号已注册！')
    }

    const UID = generateUID()

    // 密码哈希加盐
    const encryptedPassword = this.bcrtptService.hashSync(password)

    const user = new User()
    user._id = new ObjectId()
    user.UID = UID
    user.account = account
    user.nickname = nickname
    user.encryptedPassword = encryptedPassword

    const newUser = await this.usersRepository.save(user)
    if (!newUser) throw '创建新用户失败！'
    return newUser
  }

  /** 通过账号查询用户 */
  async findOneByAccount(account: string) {
    const user = await this.usersRepository.findOne({ where: { account: account } })
    return user || null
  }

  /** 通过 id 查询用户 */
  async findOneById(id: ObjectId) {
    const user = await this.usersRepository.findOneBy(id)
    return user || null
  }

  /** 通过 id 查询用户基本信息 */
  async getInfoById(_id: ObjectId, dirname: string) {
    const user = await this.findOneById(_id)
    const avatar = user.avatar
      ? this.storageService.getFilePath({
          filename: user.avatar,
          dirname: dirname,
          category: 'image',
          prv: false
        })
      : ''
    if (user) {
      return {
        UID: user.UID,
        account: user.account,
        nickname: user.nickname,
        email: user.email,
        avatar: avatar,
        phone: user.phone,
        // homepage: user.homepage,
        desc: user.desc,
        receiverConfig: user.receiverConfig
      }
    } else {
      return null
    }
  }

  /** 更新接收器状态 */
  async updateReceiverConfig(_id: ObjectId, status: 0 | 1 | 2) {
    // console.log(status)
    const user = await this.usersRepository.findOneBy(_id)
    user.receiverConfig = {
      status: status,
      autoParse: user.receiverConfig.autoParse
    }
    const newUser = await this.usersRepository.save(user)
    if (newUser) return { updateAt: newUser.updateAt }
    throw new Error('更新接收器状态失败！')
  }

  async getBlogger(UID: string) {
    const user = await this.usersRepository.findOne({
      where: { UID: UID },
      select: ['UID', 'nickname', 'avatar', 'email', 'phone', 'desc', 'createAt']
    })
    user.avatar = user.avatar
      ? this.storageService.getFilePath({
          filename: user.avatar,
          dirname: UID,
          category: 'image',
          prv: false
        })
      : ''
    return user
  }

  /** 通过 ssoid 查询用户 */
  // async findOneBySsoId(sso_id: ObjectId) {
  //   const user = await this.usersRepository.findOneBy({ sso_id: sso_id })
  //   return user || null
  // }

  /** 检测目标用户是否存在，在不存在时创建目标新用户 */
  // async checkUserExistAndCompleted(userInfo: { sso_id: string; account: string }) {
  //   const { sso_id, account } = userInfo
  //   const user = await this.findOneBySsoId(new ObjectId(sso_id))
  //   if (!user) {
  //     console.log(`未检测到用户${account}`)
  //     const newUser = await this.create({ sso_id, account })
  //     console.log('成功创建用户：' + newUser.account)
  //     if (newUser) return true
  //     else return false
  //   }
  //   return true
  // }
}
const __rootdirname = process.cwd()
/** 生成用户私有文件夹的地址 */
function generateUID() {
  let UID = generateRandomStr()
  // const forbiddenCharsRegex = /[:*?"<>|\\/]/
  // dirPath = dirPath.replace(forbiddenCharsRegex, '')
  // 校验该地址是否已经存在
  // console.log(path)
  let fullPath1 = path.join(__rootdirname, 'public', UID)
  let fullPath2 = path.join(__rootdirname, 'private', UID)
  while (fs.existsSync(fullPath1) || fs.existsSync(fullPath2)) {
    // console.log('该用户文件夹已存在，重新生成')
    UID = generateRandomStr()
    fullPath1 = path.join(__rootdirname, 'public', UID)
    fullPath2 = path.join(__rootdirname, 'private', UID)
  }
  return UID
}

/** 生成随机字符串 */
function generateRandomStr(num = 8) {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''

  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
}
