import {
  Controller, Get, Param, Post, Body, Put, Delete,
} from '@nestjs/common';
import { CategoriesService } from '../../services/categories/categories.service';

@Controller('categories') // Définit la route de base pour ce contrôleur : /categories
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  // Récupère toutes les catégories
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  // Récupère une catégorie spécifique par son ID
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id); // +id convertit l'ID string en number
  }

  @Get('/dto/:id')
  // Récupère une catégorie sous forme de DTO (Data Transfer Object) par ID
  findOneDto(@Param('id') id: string) {
    return this.categoriesService.findOneDto(+id); // Version "allégée" ou structurée différemment
  }

  @Post()
  // Crée une nouvelle catégorie avec un nom
  create(@Body() data: { nom: string }) {
    return this.categoriesService.create(data);
  }

  @Put(':id')
  // Met à jour une catégorie existante par ID avec un nouveau nom
  update(@Param('id') id: string, @Body() data: { nom: string }) {
    return this.categoriesService.update(+id, data);
  }

  @Delete(':id')
  // Supprime une catégorie par son ID
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
