import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Session, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { UpdateUserDto, CreateUserDto } from './dto/_api'
import { Response } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { REST } from 'src/enum'
import { ApiTags } from '@nestjs/swagger'

@Controller('user')
@ApiTags('用户')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(`${REST.W}/create`)
  create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      this.userService.create(createUserDto).then(user => {
        console.log('博客业务系统用户注册成功！')
        res.status(201).send('博客业务系统用户注册成功！')
      })
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${REST.R}/info`)
  async getUserInfo(@Req() req, @Res() res) {
    // console.log('请求用户数据：' + req.user._id)
    const info = await this.userService.getInfoById(req.user._id, req.user.dirname)
    info.avatar = 'http://' + req.headers.host + '/assets' + info.avatar.split('assets')[1]
    if (!info) {
      return res.status(400).send('权限不足，获取用户信息失败！')
    }
    // console.log(info)
    return res.status(200).send(info)
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${REST.U}/receiver/:status`)
  async updateReceiverStatus(@Param('status') status: number, @Req() req, @Res() res) {
    try {
      if (typeof status === 'string') {
        status = Number(status)
      }
      if (![0, 1, 2].includes(status)) return res.status(400).send('参数错误')
      const result = await this.userService.updateReceiverConfig(req.user.userId, status as 0 | 1 | 2)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  /** ------------------------------- Blog ---------------------------*/
  // @Get(`${REST.R}/blogger/account/:account`)
  // async getBloggers(@Param() account: string, @Req() req, @Res() res) {
  //   const dir = await this.userService.getDirByUserId(req.user.userId)
  //   if (!dir) {
  //     return res.status(401).send('权限不足，获取用户信息失败！')
  //   }
  //   return res.status(200).send(dir)
  // }
}
