import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const { Titre, Contenu, tags: tagEntities, utilisateur, Image } = data; // Ajout de `Image`

    let tags = [];
    if (data.tagNames) {
      tags = await Promise.all(
        (data.tagNames || []).map(async (name: string) => {
          let tag = await this.tagRepo.findOne({ where: { Nom: name } });
          if (!tag) {
            tag = this.tagRepo.create({ Nom: name });
            await this.tagRepo.save(tag);
          }
          return tag;
        }),
      );
    } else if (tagEntities) {
      tags = tagEntities;
    }

    const article = this.articleRepo.create({ Titre, Contenu, tags, utilisateur, Image }); // Ajout de `Image`
    return this.articleRepo.save(article);
  }

  findAll(): Promise<Article[]> {
    return this.articleRepo.find({ relations: ['tags'] });
  }

  async findOne(id: number, relations: string[] = []): Promise<Article | null> {
    return await this.articleRepo.findOne({
      where: { IdArticle: id },
      relations,
    });
  }

  async remove(id: number): Promise<void> {
    await this.articleRepo.delete(id);
  }

  async findAllWithAuthorAndTags(): Promise<Article[]> {
    return this.articleRepo.find({
      relations: ['utilisateur', 'tags'],
      order: { DateCreation: 'DESC' }
    });
  }

  async update(id: number, data: Partial<Article>): Promise<Article> {
    const { Image, ...otherData } = data; // Gestion de `Image`
    await this.articleRepo.update(id, { ...otherData, ...(Image ? { Image } : {}) }); // Mise à jour conditionnelle
    return this.findOne(id, ['tags', 'utilisateur']);
  }

  async findAuteur(idAuteur: number): Promise<User | null> {
    return await this.userRepo.findOneBy({ idUtilisateur: idAuteur });
  }

  async save(article: Article): Promise<Article> {
    return this.articleRepo.save(article);
  }
}
