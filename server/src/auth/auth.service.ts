import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/user/entities/user.entity'
import { ApiService } from 'src/api/api.service'
import { ObjectId } from 'mongodb'
import { BcryptService } from 'src/bcrypt/bcrypt.service'
import { CreateUserDto } from 'src/user/dto/create-user.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly bcrtptService: BcryptService
  ) {}

  /** 注册 */
  register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  /** 登录：生成 token */
  async login(user: User) {
    try {
      if (!user) {
        throw new UnauthorizedException('用户邮箱或密码错误！')
      }
      const token = this.jwtService.sign({ userId: user._id, account: user.account, UID: user.UID })
      return token
    } catch (error) {
      console.log(error)
      return error
    }
  }

  /** 用户密码登录验证 */
  async validateUser(account: string, password: string) {
    // 用户是否存在
    const user = await this.userService.findOneByAccount(account)
    // console.log(user)
    if (!user) return null
    // 用户密码是否正确
    const valid = this.bcrtptService.compareSync(password, user.encryptedPassword)
    if (valid) return user
    return null
  }
}
