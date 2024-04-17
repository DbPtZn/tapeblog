import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Res } from '@nestjs/common'
import { CollectionService } from './collection.service'
import { CreateCollectionDto } from './dto/create-collection.dto'
import { REST } from 'src/enum'
import { AuthGuard } from '@nestjs/passport'
import { ObjectId } from 'mongodb'

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(`${REST.W}/create`)
  create(@Body() createCollectionDto: CreateCollectionDto, @Req() req) {
    // console.log(req.user)
    return this.collectionService.create(createCollectionDto, req.user._id, req.user.account, req.user.UID)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${REST.R}/all`)
  findAll(@Req() req, @Res() res) {
    return this.collectionService
      .findAll(req.user._id)
      .then(collections => {
        const data = collections.map(item => {
          return {
            id: item._id,
            name: item.name,
            isPublish: item.isPublish,
            updateAt: item.updateAt,
            createAt: item.createAt
          }
        })
        res.status(200).send(data)
      })
      .catch(err => {
        res.status(400).send(err)
      })
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${REST.R}/unfiled`)
  findUnfiled(@Req() req, @Res() res) {
    this.collectionService
      .findUnfiled(req.user._id)
      .then(collection => {
        res.status(200).send(collection)
      })
      .catch(err => {
        res.status(400).send(err)
      })
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(`${REST.R}/:id`)
  findOne(@Param('id') id: string, @Req() req, @Res() res) {
    this.collectionService
      .genCollectionData(new ObjectId(id), req.user._id)
      .then(data => {
        // console.log(data)
        res.status(200).send(data)
      })
      .catch(err => {
        res.status(400).send(err)
      })
  }

  /** --------------- 公开访问的地址 (无需鉴权) ------------------ */
  @Get(`${REST.R}/:UID`)
  findPublished(@Param('UID') UID: string, @Req() req, @Res() res) {
    return this.collectionService.findPublished(UID)
  }

  @Get(`blog/${REST.R}/:UID`)
  findCollectionToBlog(@Param('UID') UID: string, @Req() req, @Res() res) {
    console.log(UID)
    this.collectionService
      .genCollectionDataToBlog(UID)
      .then(data => {
        // console.log(data)
        res.status(200).send(data)
      })
      .catch(err => {
        res.status(400).send(err)
      })
  }
}
