import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ArticleService } from './article.service'
import { REST } from 'src/enum'
import { ObjectId } from 'mongodb'

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // @Get()
  // findAll() {
  //   return this.articleService.findAll();
  // }

  // @Get(`${REST.R}/:id`)
  // findOne(@Param('id') id: string) {
  //   const _id = new ObjectId(id)
  //   return this.articleService.findProduct(_id)
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
  //   return this.articleService.update(+id, updateArticleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.articleService.remove(+id);
  // }
}
