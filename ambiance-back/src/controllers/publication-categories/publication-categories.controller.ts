import { Controller, Post, Delete, Param, Get } from '@nestjs/common';
import { PublicationCategoriesService } from 'src/services/publication-categories/publication-categories.service';

@Controller('publication-categories') // Route de base pour les opérations publication-catégorie
export class PublicationCategoriesController {
  constructor(private readonly pcService: PublicationCategoriesService) {}

  // Associe une catégorie à une publication
  @Post(':IdPublication/:IdCategorie')
  addCategoryToPublication(
    @Param('IdPublication') IdPublication: string,
    @Param('IdCategorie') IdCategorie: string,
  ) {
    return this.pcService.addCategoryToPublication(
      +IdPublication,
      +IdCategorie,
    );
  }

  // Supprime l'association entre une catégorie et une publication
  @Delete(':IdPublication/:IdCategorie')
  removeCategoryFromPublication(
    @Param('IdPublication') IdPublication: string,
    @Param('IdCategorie') IdCategorie: string,
  ) {
    return this.pcService.removeCategoryFromPublication(
      +IdPublication,
      +IdCategorie,
    );
  }

  // Récupère toutes les catégories associées à une publication donnée
  @Get('publication/:IdPublication')
  getCategoriesByPublication(@Param('IdPublication') IdPublication: string) {
    return this.pcService.findCategoriesByPublication(+IdPublication);
  }

  // Récupère toutes les publications associées à une catégorie donnée
  @Get('categorie/:IdCategorie')
  getPublicationsByCategorie(@Param('IdCategorie') IdCategorie: string) {
    return this.pcService.findPublicationsByCategorie(+IdCategorie);
  }
}
