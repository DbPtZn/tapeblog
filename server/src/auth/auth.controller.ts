import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, Session, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserService } from 'src/user/user.service'
import { LoginDto } from './dto/login.dto'
import { Response, Request } from 'express'
import { JwtAuthGuard } from './auth.guard'
import { AuthGuard } from '@nestjs/passport'
import { REST } from 'src/enum'
import { ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from 'src/user/dto/create-user.dto'

// @UseGuards(JwtAuthGuard)
@Controller('auth')
@ApiTags('权限')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(`${REST.W}/register`)
  register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      console.log(createUserDto)
      this.authService
        .register(createUserDto)
        .then(user => {
          res.status(201).send({ id: user._id })
        })
        .catch(error => {
          console.log(error)
          res.status(400).send({ msg: '用户注册失败', error: error })
        })
    } catch (error) {
      res.status(400).send({ msg: '用户注册失败', error: error })
    }
  }

  /** 登录请求 */
  @UseGuards(AuthGuard('local'))
  @Post(`${REST.R}/login`)
  async login(@Body() loginDto: LoginDto, @Req() req, @Res() res: Response) {
    const token = await this.authService.login(req.user)
    if (token) {
      res.status(200).send(token)
    } else {
      res.status(401).send('登录验证失败')
    }
  }
}
