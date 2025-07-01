import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Logger,
  Req,
} from '@nestjs/common';
import { CategoriesService } from '../../services/categories/categories.service';

@Controller('categories')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@Req() req?: Request) {
    this.logger.log('[INFO] [GET /categories] Fetching all categories');
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req?: Request) {
    this.logger.log(
      '[INFO] [GET /categories/:id] Fetching category by ID',
      { categoryId: +id }
    );
    return this.categoriesService.findOne(+id);
  }

  @Get('/dto/:id')
  findOneDto(@Param('id') id: string, @Req() req?: Request) {
    this.logger.log(
      '[INFO] [GET /categories/dto/:id] Fetching category DTO by ID',
      { categoryId: +id }
    );
    return this.categoriesService.findOneDto(+id);
  }

  @Post()
  create(@Body() data: { nom: string }, @Req() req?: Request) {
    this.logger.log(
      '[INFO] [POST /categories] Creating new category',
      { categoryName: data.nom }
    );
    return this.categoriesService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: { nom: string }, @Req() req?: Request) {
    this.logger.log(
      '[INFO] [PUT /categories/:id] Updating category',
      { categoryId: +id, newName: data.nom }
    );
    return this.categoriesService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req?: Request) {
    this.logger.log(
      '[INFO] [DELETE /categories/:id] Removing category',
      { categoryId: +id }
    );
    return this.categoriesService.remove(+id);
  }
}
