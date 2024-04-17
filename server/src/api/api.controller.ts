import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ApiService } from './api.service'

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}
  //
}
