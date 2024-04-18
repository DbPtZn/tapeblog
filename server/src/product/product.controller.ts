import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common'
import { ProductService } from './product.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto, UpdateTitleDto } from './dto/update-product.dto'
import { ApiService } from 'src/api/api.service'
import { REST } from 'src/enum'
import { ObjectId } from 'mongodb'
import { AuthGuard } from '@nestjs/passport'
import { ParseDto } from './dto/parse-product.dto'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @Post(`${REST.W}/create`)
  // async create(@Body() createProductDto: CreateProductDto, @Req() req, @Res() res) {
  //   console.log(createProductDto)
  //   const product = await this.productService.create(createProductDto)
  //   // console.log(product)
  //   res.status(201).send('提交作品成功！')
  // }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${REST.R}/unfiled`)
  findAllUnfiled(@Req() req) {
    return this.productService.findAllUnfiled(req.user._id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${REST.R}/:id`)
  async findOne(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      this.productService
        .findOne(new ObjectId(id), req.user._id, req.user.UID)
        .then(product => {
          // console.log(product.audio)
          // if (!product.isParsed) {
          product.audio = 'http://' + req.headers.host + '/public' + product.audio.split('public')[1] || ''
          // }
          res.status(200).send(product)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${REST.U}/allocation`)
  allocation(
    @Body() allocationProductDto: { id: string; collectionId: string | null; isPublish: boolean },
    @Req() req,
    @Res() res
  ) {
    try {
      const { id, collectionId, isPublish } = allocationProductDto
      console.log(allocationProductDto)
      const _id = new ObjectId(id)
      const _collectionId = collectionId ? new ObjectId(collectionId) : null
      this.productService
        .allocation(_id, _collectionId, isPublish, req.user._id)
        .then(msg => {
          res.status(200).send(true)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${REST.U}/revoke/:id`)
  revoke(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      this.productService
        .revoke(new ObjectId(id), req.user._id)
        .then(msg => {
          res.status(200).send(true)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${REST.R}/unparsed/:filename`)
  async findUnparsedFile(@Param('filename') filename: string, @Req() req, @Res() res) {
    try {
      this.productService
        .findUnparseFile(filename, req.user.UID)
        .then(file => {
          res.status(200).send(file)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${REST.U}/parse`)
  parse(@Body() parseDto: ParseDto, @Req() req, @Res() res) {
    try {
      this.productService
        .parse(parseDto, req.user._id)
        .then(product => {
          res.status(200).send(product)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    } catch (error) {
      res.status(400).send(error)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${REST.U}/publish/:id`)
  async publish(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.productService.publish(new ObjectId(id), req.user._id)
      res.status(200).send(result.isPublish)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${REST.U}/title`)
  async updateTitle(@Body() updateTitleDto: UpdateTitleDto, @Req() req, @Res() res) {
    try {
      const result = await this.productService.updateTitle(updateTitleDto, req.user._id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(`${REST.U}/remove/:id`)
  async remove(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const result = await this.productService.remove(new ObjectId(id), req.user._id)
      res.status(200).send(result)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  /** ----------------------- 博客前端的服务 ------------------------- */
  // @Get(`${REST.R}/:UID`)
  // findOneToBlog(@Param('UID') UID: string, @Req() req, @Res() res) {
  //   try {
  //     // const _id = new ObjectId(id)
  //     this.productService
  //       .findOneToBlog(UID)
  //       .then(product => {
  //         res.status(200).send(product)
  //       })
  //       .catch(err => {
  //         res.status(400).send(err)
  //       })
  //   } catch (error) {
  //     res.status(400).send(error)
  //   }
  // }

  @Post(`${REST.R}/list`)
  async findListToBlog(@Body() dto: { UID: string; take: number; skip: number }, @Req() req, @Res() res) {
    try {
      const { UID, take, skip } = dto
      this.productService
        .findListToBlog(UID, take, skip)
        .then(products => {
          const data = products.map(product => {
            return {
              id: product._id,
              ...product
            }
          })
          res.status(200).send(data)
        })
        .catch(err => {
          res.status(400).send(err)
        })
    } catch (error) {
      res.status(400).send(error)
    }
  }

  // @Post(`${REST.R}/collection`)
  // async findByCollectionToBlog(
  //   @Body() dto: { UID: string; collectionId: string; take: number; skip: number },
  //   @Req() req,
  //   @Res() res
  // ) {
  //   try {
  //     const { UID, collectionId, take, skip } = dto
  //     this.productService
  //       .findByCollectionToBlog(UID, new ObjectId(collectionId), take, skip)
  //       .then(product => {
  //         res.status(200).send(product)
  //       })
  //       .catch(err => {
  //         res.status(400).send(err)
  //       })
  //   } catch (error) {
  //     res.status(400).send(error)
  //   }
  // }
}
