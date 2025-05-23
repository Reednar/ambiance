import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Article } from '../../entities/articles.entity';
import { Tag } from '../../entities/tag.entity';
import { User } from '../../entities/users.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,

    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(data: any): Promise<Article> {
  const { titre, contenu, tagIds, utilisateur, image, dateCreation, idEcole } = data;

  // Gestion des tags (comme tu l'as déjà)
   let tags = [];
  if (Array.isArray(tagIds) && tagIds.length > 0) {
    tags = await this.tagRepo.find({ where: { idTag: In(tagIds) } });
  }

  const article = this.articleRepo.create({
    titre,
    contenu,
    tags,
    utilisateur,
    image,
    idEcole,
    dateCreation: dateCreation || new Date(),
  });

  return this.articleRepo.save(article);
}



  findAll(): Promise<Article[]> {
    return this.articleRepo.find({ relations: ['tags'] });
  }

 async findOne(
  id: number, 
  relations: string[] = ['utilisateur', 'ecole', 'tags']
): Promise<Article | null> {
  return await this.articleRepo.findOne({
    where: { idArticle: id },
    relations,
  });
}


  async remove(id: number): Promise<void> {
    await this.articleRepo.delete(id);
  }

  async findAllWithAuthorAndTags(): Promise<Article[]> {
    return this.articleRepo.find({
      relations: ['utilisateur', 'tags', 'utilisateur.ecole', 'ecole'],
      order: { dateCreation: 'DESC' }
    });
  }

  // async update(id: number, data: Partial<Article>): Promise<Article> {
  //   const { image, ...otherData } = data; // Gestion de `Image`
  //   await this.articleRepo.update(id, { ...otherData, ...(image ? { image } : {}) }); // Mise à jour conditionnelle
  //   return this.findOne(id, ['tags', 'utilisateur']);
  // }

  async update(
  id: number,
  data: Partial<Article> & { tagIds?: number[] }
): Promise<Article> {
  const { image, tagIds, ...otherData } = data;

  // Mise à jour des champs de base
  await this.articleRepo.update(id, {
    ...otherData,
    ...(image ? { image } : {}),
  });

  const article = await this.articleRepo.findOne({
    where: { idArticle: id },
    relations: ['tags', 'utilisateur', 'ecole'],
  });

  // Mise à jour des relations tags
  if (article && tagIds) {
    const tags = await this.tagRepo.find({
      where: { idTag: In(tagIds) },
    });
    article.tags = tags;
    await this.articleRepo.save(article);
  }

  return this.findOne(id, ['tags', 'utilisateur', 'ecole']);
}


  async findAuteur(idAuteur: number): Promise<User | null> {
    return await this.userRepo.findOneBy({ idUtilisateur: idAuteur });
  }

  async save(article: Article): Promise<Article> {
    return this.articleRepo.save(article);
  }

  async findByAuthorId(authorId: number): Promise<Article[]> {
  return this.articleRepo.find({
    where: { utilisateur: { idUtilisateur: authorId } },
    relations: ['utilisateur', 'tags', 'ecole']
  });
}

}
