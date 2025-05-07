import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicationCategories } from '../../entities/publication-categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PublicationCategoriesService {
  constructor(
    @InjectRepository(PublicationCategories)
    private pcRepository: Repository<PublicationCategories>,
  ) {}

  async addCategoryToPublication(IdPublication: number, IdCategorie: number) {
    const relation = this.pcRepository.create({ IdPublication, IdCategorie });
    return this.pcRepository.save(relation);
  }

  async removeCategoryFromPublication(IdPublication: number, IdCategorie: number) {
    await this.pcRepository.delete({ IdPublication, IdCategorie });
  }

  async findCategoriesByPublication(IdPublication: number) {
    return this.pcRepository.find({
      where: { IdPublication },
      relations: ['categorie'],
    });
  }

  async findPublicationsByCategorie(IdCategorie: number) {
    return this.pcRepository.find({
      where: { IdCategorie },
      relations: ['publication'],
    });
  }
}
