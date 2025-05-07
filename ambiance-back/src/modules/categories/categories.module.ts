import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from '../../services/categories/categories.service';
import { CategoriesController } from '../../controllers/categories/categories.controller';
import { Categorie } from '../../entities/categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categorie])], // Définir l'entité Categorie ici
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService], // Mettre ça car si un module a besoin de ce service il pourra l'utiliser
})
export class CategoriesModule {}
