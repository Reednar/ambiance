import { Module } from '@nestjs/common';
import { PublicationCategoriesService } from 'src/services/publication-categories/publication-categories.service';
import { PublicationCategoriesController } from 'src/controllers/publication-categories/publication-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationCategories } from 'src/entities/publication-categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublicationCategories])],
  controllers: [PublicationCategoriesController],
  providers: [PublicationCategoriesService],
  exports: [PublicationCategoriesService],
})
export class PublicationCategoriesModule {}
