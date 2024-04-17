import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common'
import { BlogService } from './blog.service'
import { CreateBlogDto } from './dto/create-blog.dto'
import { UpdateBlogDto } from './dto/update-blog.dto'
import { REST } from 'src/enum'
import { ObjectId } from 'mongodb'

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  /** ----------------------- 博主 ------------------------- */
  @Get(`${REST.R}/blogger/:UID`)
  async findBlogger(@Param('UID') UID: string, @Req() req, @Res() res) {
    const user = await this.blogService.findBlogger(UID)
    res.status(200).send(user)
  }

  /** ----------------------- 文章 ------------------------- */
  @Get(`${REST.R}/product/:id`)
  findProductToBlog(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      // const _id = new ObjectId(id)
      this.blogService
        .findProduct(id)
        .then(product => {
          product.audio = 'http://' + req.headers.host + '/public' + product.audio.split('public')[1] || ''
          // console.log(product.abbrev)
          res.status(200).send(product)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @Post(`${REST.R}/product/list`)
  async findProductList(
    @Body() dto: { UID: string; take: number; skip: number; collectionId?: string; type?: 'course' | 'note' },
    @Req() req,
    @Res() res
  ) {
    try {
      const { UID, take, skip, collectionId, type } = dto
      console.log(dto)
      this.blogService
        .findProductList(UID, take, skip, collectionId, type)
        .then(data => {
          res.status(200).send(data)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    } catch (error) {
      res.status(400).send(error)
    }
  }

  /** ----------------------- 合辑 ------------------------- */
  @Get(`${REST.R}/collection/list/:UID`)
  async findCollectionList(@Param('UID') UID: string, @Req() req, @Res() res) {
    const result = await this.blogService.findCollectionList(UID)
    res.status(200).send(result)
  }
}
