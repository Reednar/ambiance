import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from '../../services/articles/articles.services';
import { Article } from '../../entities/articles.entity';
import { TagService } from '../../services/tags/tags.service';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';
import { SchoolsService } from 'src/services/schools/schools.service';

@Controller('articles')
export class ArticlesController {
  private readonly logger = new Logger(ArticlesController.name);

  constructor(
    private readonly articleService: ArticleService,
    private readonly tagService: TagService,
    private readonly schoolService: SchoolsService
  ) {}

  /**
   * Crée un nouvel article (protégé par JWT)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() data: any): Promise<Article> {
    this.logger.log('Creating article', data);
    return this.articleService.create(data);
  }

  /**
   * Récupère un article par son ID
   */
  @Post('findOne')
  async findOne(@Body() body: { id: number }): Promise<Article> {
    this.logger.log(`Finding article with id: ${body.id}`);
    return this.articleService.findOne(body.id);
  }

  /**
   * Supprime un article par son ID (protégé par JWT)
   */
  @Post('delete')
  @UseGuards(JwtAuthGuard)
  async remove(@Body() body: { id: number }): Promise<void> {
    this.logger.log(`Deleting article with id: ${body.id}`);
    return this.articleService.remove(body.id);
  }

  /**
   * Récupère tous les articles avec les auteurs et les tags associés
   */
  @Post('list')
  async getArticlesWithAuthorAndTags(): Promise<
    {
      id: number;
      dateCreation: Date;
      utilisateur: string;
      tags: string[];
      contenu: string;
      image: string;
      nomEcole: string | null;
      idEcole: number | null;
    }[]
  > {
    this.logger.log('Fetching all articles with authors and tags');
    const articles = await this.articleService.findAllWithAuthorAndTags();
    return articles.map(article => ({
      id: article.idArticle,
      dateCreation: article.dateCreation,
      utilisateur: article.utilisateur
        ? `${article.utilisateur.prenom} ${article.utilisateur.nom}`
        : null,
      tags: article.tags ? article.tags.map(tag => tag.nom) : [],
      contenu: article.contenu,
      image: article.image,
      nomEcole: article?.ecole?.nom ?? null,
      idEcole: article?.ecole?.id ?? null,
    }));
  }

  /**
   * Récupère tous les tags disponibles
   */
  @Post('tags')
  async getAllTags(): Promise<{ id: number; nom: string }[]> {
    this.logger.log('Fetching all tags');
    const tags = await this.tagService.findAll();
    return tags.map(tag => ({
      id: tag.idTag,
      nom: tag.nom,
    }));
  }

  /**
   * Ajoute des tags à un article existant (protégé par JWT)
   */
  @Post('add-tags')
  @UseGuards(JwtAuthGuard)
  async addTagsToArticle(
    @Body() body: { articleId: number; tags: string[] }
  ): Promise<{ message: string; article: Article }> {
    this.logger.log(`Adding tags to article ${body.articleId}: ${body.tags}`);
    const { articleId, tags } = body;

    const article = await this.articleService.findOne(articleId, ['tags']);
    if (!article) {
      this.logger.error(`Article not found: ${articleId}`);
      throw new Error('Article not found');
    }

    article.tags = article.tags || [];
    for (const tagName of tags) {
      let tag = await this.tagService.create(tagName);
      if (!article.tags.find(t => t.idTag === tag.idTag)) {
        article.tags.push(tag);
      }
    }

    const updatedArticle = await this.articleService.save(article);
    this.logger.log(`Tags added to article ${articleId}`);
    return { message: 'Tags ajoutés à l\'article', article: updatedArticle };
  }

  /**
   * Supprime des tags d'un article existant (protégé par JWT)
   */
  @Post('remove-tags')
  @UseGuards(JwtAuthGuard)
  async removeTagsFromArticle(
    @Body() body: { articleId: number; tags: string[] }
  ): Promise<{ message: string; article: Article }> {
    this.logger.log(`Removing tags from article ${body.articleId}: ${body.tags}`);
    const { articleId, tags } = body;

    const article = await this.articleService.findOne(articleId, ['tags']);
    if (!article) {
      this.logger.error(`Article not found: ${articleId}`);
      throw new Error('Article not found');
    }

    article.tags = (article.tags || []).filter(tag => !tags.includes(tag.nom));
    const updatedArticle = await this.articleService.save(article);

    this.logger.log(`Tags removed from article ${articleId}`);
    return { message: 'Tags retirés de l\'article', article: updatedArticle };
  }

  /**
   * Crée un nouvel article en précisant les détails comme auteur, école, image, tags (protégé par JWT)
   */
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createArticle(
    @Body() body: {
      titre: string;
      contenu: string;
      idAuteur: number;
      id_ecole?: number;
      image?: string;
      tagIds?: number[];
    }
  ): Promise<Article> {
    this.logger.log(`Creating article with title: ${body.titre} by author: ${body.idAuteur}`);
    const utilisateur = await this.articleService.findAuteur(body.idAuteur);
    if (!utilisateur) {
      this.logger.error(`Auteur not found: ${body.idAuteur}`);
      throw new Error('Auteur not found');
    }

    if (body.image && !body.image.startsWith('http')) {
      throw new Error('Invalid image URL');
    }

    const ecole = body.id_ecole ? await this.schoolService.findOne(body.id_ecole) : null;
    const articleData: Partial<any> = {
      titre: body.titre,
      contenu: body.contenu,
      utilisateur: utilisateur,
      dateCreation: new Date(),
      image: body.image,
      idEcole: body.id_ecole,
      ...(ecole ? { ecole } : {}),
      tagIds: body.tagIds,
    };

    return await this.articleService.create(articleData);
  }

  /**
   * Récupère un article avec son auteur et ses informations liées
   */
  @Post('findWithAuthor')
  async findArticleWithAuthor(
    @Body() body: { id: number }
  ): Promise<{
    id: number;
    titre: string;
    contenu: string;
    dateCreation: Date;
    utilisateur: string;
    tags: string[];
    nomEcole?: string;
    idEcole?: number;
  }> {
    this.logger.log(`Finding article with author for id: ${body.id}`);
    const article = await this.articleService.findOne(body.id, ['utilisateur']);
    if (!article) {
      this.logger.error(`Article not found: ${body.id}`);
      throw new Error('Article not found');
    }

    return {
      id: article.idArticle,
      titre: article.titre,
      contenu: article.contenu,
      dateCreation: article.dateCreation,
      utilisateur: article.utilisateur
        ? `${article.utilisateur.prenom} ${article.utilisateur.nom}`
        : null,
      tags: article.tags ? article.tags.map(tag => tag.nom) : [],
      nomEcole: article?.ecole?.nom ?? null,
      idEcole: article?.ecole?.id ?? null,
    };
  }

  /**
   * Récupère tous les articles d'un auteur donné
   */
  @Post('findAllByAuthor')
  async findAllByAuthor(
    @Body() body: { id: number }
  ): Promise<
    Array<{
      id: number;
      titre: string;
      contenu: string;
      dateCreation: Date;
      utilisateur: string;
      tags: string[];
      nomEcole?: string;
      idEcole?: number;
    }>
  > {
    this.logger.log(`Finding all articles for author ID: ${body.id}`);
    const articles = await this.articleService.findByAuthorId(body.id);

    return articles.map(article => ({
      id: article.idArticle,
      titre: article.titre,
      contenu: article.contenu,
      dateCreation: article.dateCreation,
      utilisateur: article.utilisateur
        ? `${article.utilisateur.prenom} ${article.utilisateur.nom}`
        : '',
      tags: article.tags?.map(tag => tag.nom) || [],
      nomEcole: article.ecole?.nom ?? null,
      idEcole: article.ecole?.id ?? null,
    }));
  }
}
