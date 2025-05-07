import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categorie } from '../../entities/categories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categorie)
    private readonly categoriesRepository: Repository<Categorie>,
  ) {}

  async findAll(): Promise<Categorie[]> {
    return await this.categoriesRepository.find();
  }

  async findOne(id: number): Promise<Categorie> {
    return await this.categoriesRepository.findOneBy({ idCategorie: id });
  }

  async create(categorie: Partial<Categorie>): Promise<Categorie> {
    const newCategorie = this.categoriesRepository.create(categorie);
    return await this.categoriesRepository.save(newCategorie);
  }

  async update(id: number, updateData: Partial<Categorie>): Promise<Categorie> {
    await this.categoriesRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.categoriesRepository.delete(id);
  }
}
