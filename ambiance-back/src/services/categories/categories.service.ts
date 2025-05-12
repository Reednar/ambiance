import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categorie } from '../../entities/categories.entity';
import { CategorieDto } from 'src/dtos/categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categorie)
    private readonly categoriesRepository: Repository<Categorie>,
  ) {}

  // async findAll(): Promise<Categorie[]> {
  //   return await this.categoriesRepository.find();
  // }

  async findAll(): Promise<CategorieDto[]> {
    const categories = await this.categoriesRepository
      .createQueryBuilder('categorie')
      .leftJoinAndSelect('categorie.publicationCategories', 'publicationCategories')
      .leftJoinAndSelect('publicationCategories.publication', 'publication') // Récupère les publications associées
      .getMany();

    return categories.map(category => {
      // Récupérer la liste des publications associées à cette catégorie
      const publications = category.publicationCategories.map(pc => ({
        id: pc.publication.idPublication,
        nom: pc.publication.titre,
      }));

      // Calculer le nombre de publications
      const nombrePublications = category.publicationCategories.length;

      return {
        idCategorie: category.idCategorie,
        nom: category.nom,
        publications,
        publicationCategories: category.publicationCategories, // Tu peux conserver cette relation si besoin
        nombrePublications, // Nombre total de publications dans cette catégorie
      };
    });
  }

  async findOne(id: number): Promise<Categorie> {
    return await this.categoriesRepository.findOneBy({ idCategorie: id });
  }

  async findOneDto(id: number): Promise<CategorieDto> {
    const category = await this.categoriesRepository
      .createQueryBuilder('categorie')
      .leftJoinAndSelect('categorie.publicationCategories', 'publicationCategories')
      .leftJoinAndSelect('publicationCategories.publication', 'publication')
      .where('categorie.idCategorie = :id', { id })
      .getOne();
  
    if (!category) {
      throw new NotFoundException(`Catégorie avec l'id ${id} non trouvée`);
    }
  
    const publications = category.publicationCategories.map(pc => ({
      id: pc.publication.idPublication,
      nom: pc.publication.titre,
    }));
  
    const nombrePublications = category.publicationCategories.length;
  
    return {
      idCategorie: category.idCategorie,
      nom: category.nom,
      publications,
      publicationCategories: category.publicationCategories,
      nombrePublications,
    };
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
