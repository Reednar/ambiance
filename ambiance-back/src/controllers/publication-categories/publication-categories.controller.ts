import {
    Controller, Post, Delete, Param, Get,
  } from '@nestjs/common';
import { PublicationCategoriesService } from 'src/services/publication-categories/publication-categories.service';  
  @Controller('publication-categories')
  export class PublicationCategoriesController {
    constructor(private readonly pcService: PublicationCategoriesService) {}

    @Post(':IdPublication/:IdCategorie')
    addCategoryToPublication(
      @Param('IdPublication') IdPublication: string,
      @Param('IdCategorie') IdCategorie: string,
      ) {
        return this.pcService.addCategoryToPublication(+IdPublication, +IdCategorie);
      }

    
      @Delete(':IdPublication/:IdCategorie')
    removeCategoryFromPublication(
      @Param('IdPublication') IdPublication: string,
      @Param('IdCategorie') IdCategorie: string,
    ) {
      return this.pcService.removeCategoryFromPublication(+IdPublication, +IdCategorie);
    }

    @Get('publication/:IdPublication')
    getCategoriesByPublication(@Param('IdPublication') IdPublication: string) {
      return this.pcService.findCategoriesByPublication(+IdPublication);
    }

    @Get('categorie/:IdCategorie')
    getPublicationsByCategorie(@Param('IdCategorie') IdCategorie: string) {
      return this.pcService.findPublicationsByCategorie(+IdCategorie);
    }

  }
  