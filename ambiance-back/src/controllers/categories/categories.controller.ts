import {
  Controller, Get, Param, Post, Body, Put, Delete,
} from '@nestjs/common';
import { CategoriesService } from '../../services/categories/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Post()
  create(@Body() data: { nom: string }) {
    return this.categoriesService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: { nom: string }) {
    return this.categoriesService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
