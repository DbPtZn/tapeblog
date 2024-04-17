import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common'
import { AuthcodeService } from './authcode.service'
import { CreateAuthcodeDto } from './dto/create-authcode.dto'
import { UpdateAuthcodeDto } from './dto/update-authcode.dto'
import { REST } from 'src/enum'
// import { ObjectId } from 'typeorm'
import { ObjectId } from 'mongodb'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard('jwt'))
@Controller('authcode')
export class AuthcodeController {
  constructor(private readonly authcodeService: AuthcodeService) {}

  @Post(`${REST.W}/add`)
  async add(@Req() req, @Res() res) {
    try {
      const authcode = await this.authcodeService.add(req.user._id)
      res.status(201).send(authcode)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }

  @Get(`${REST.R}/all`)
  async findAll(@Req() req, @Res() res) {
    try {
      const authcodes = await this.authcodeService.findAll(req.user._id)
      res.status(201).send(authcodes)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }

  @Get(`${REST.R}/:id`)
  findOne(@Param('id') id: string, @Req() req, @Res() res) {
    return this.authcodeService.findOne(new ObjectId(id), req.user._id)
  }

  @Patch(`${REST.U}`)
  async update(@Body() updateAuthcodeDto: UpdateAuthcodeDto, @Req() req, @Res() res) {
    try {
      const authcode = await this.authcodeService.update(updateAuthcodeDto, req.user._id)
      res.status(200).send(authcode)
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Delete(`${REST.D}/:id`)
  async remove(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.authcodeService.remove(new ObjectId(id), req.user._id)
      res.status(200).send(result)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }
}
