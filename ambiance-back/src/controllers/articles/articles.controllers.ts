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
    private readonly schoolService: SchoolsService,
  ) {}

  /**
   * Crée un nouvel article (protégé par JWT)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: any): Promise<Article> {
    try {
      this.logger.log(`[INFO] Creating article - authorId: ${data.idAuteur}, titre: ${data.titre}`);
      const article = await this.articleService.create(data);
      this.logger.log(`[INFO] Article created successfully - articleId: ${article.idArticle}, authorId: ${data.idAuteur}`);
      return article;
    } catch (error) {
      this.logger.error(`[ERROR] Failed to create article - authorId: ${data.idAuteur}, error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère un article par son ID
   */
  @Post('findOne')
  async findOne(@Body() body: { id: number }): Promise<Article> {
    try {
      this.logger.log(`[INFO] Finding article - articleId: ${body.id}`);
      const article = await this.articleService.findOne(body.id);
      if (article) {
        this.logger.log(`[INFO] Article found successfully - articleId: ${body.id}, title: ${article.titre}`);
      } else {
        this.logger.warn(`[WARN] Article not found - articleId: ${body.id}`);
      }
      return article;
    } catch (error) {
      this.logger.error(`[ERROR] Failed to find article - articleId: ${body.id}, error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Supprime un article par son ID (protégé par JWT)
   */
  @Post('delete')
  @UseGuards(JwtAuthGuard)
  async remove(@Body() body: { id: number }): Promise<void> {
    try {
      this.logger.log(`[INFO] Deleting article - articleId: ${body.id}`);
      await this.articleService.remove(body.id);
      this.logger.log(`[INFO] Article deleted successfully - articleId: ${body.id}`);
    } catch (error) {
      this.logger.error(`[ERROR] Failed to delete article - articleId: ${body.id}, error: ${error.message}`);
      throw error;
    }
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
    try {
      this.logger.log('[INFO] Fetching all articles with authors and tags');
      const articles = await this.articleService.findAllWithAuthorAndTags();
      this.logger.log(`[INFO] Articles retrieved successfully - count: ${articles.length}`);
      return articles.map((article) => ({
        id: article.idArticle,
        dateCreation: article.dateCreation,
        utilisateur: article.utilisateur
          ? `${article.utilisateur.prenom} ${article.utilisateur.nom}`
          : null,
        tags: article.tags ? article.tags.map((tag) => tag.nom) : [],
        contenu: article.contenu,
        image: article.image,
        nomEcole: article?.ecole?.nom ?? null,
        idEcole: article?.ecole?.id ?? null,
      }));
    } catch (error) {
      this.logger.error(`[ERROR] Failed to fetch articles with authors and tags - error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère tous les tags disponibles
   */
  @Post('tags')
  async getAllTags(): Promise<{ id: number; nom: string }[]> {
    try {
      this.logger.log('[INFO] Fetching all tags');
      const tags = await this.tagService.findAll();
      this.logger.log(`[INFO] Tags retrieved successfully - count: ${tags.length}`);
      return tags.map((tag) => ({
        id: tag.idTag,
        nom: tag.nom,
      }));
    } catch (error) {
      this.logger.error(`[ERROR] Failed to fetch tags - error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Ajoute des tags à un article existant (protégé par JWT)
   */
  @Post('add-tags')
  @UseGuards(JwtAuthGuard)
  async addTagsToArticle(
    @Body() body: { articleId: number; tags: string[] },
  ): Promise<{ message: string; article: Article }> {
    try {
      this.logger.log(`[INFO] Adding tags to article - articleId: ${body.articleId}, tags: ${JSON.stringify(body.tags)}`);
      const { articleId, tags } = body;

      const article = await this.articleService.findOne(articleId, ['tags']);
      if (!article) {
        this.logger.warn(`[WARN] Article not found for tag addition - articleId: ${articleId}`);
        throw new Error('Article not found');
      }

      article.tags = article.tags || [];
      for (const tagName of tags) {
        const tag = await this.tagService.create(tagName);
        if (!article.tags.find((t) => t.idTag === tag.idTag)) {
          article.tags.push(tag);
        }
      }

      const updatedArticle = await this.articleService.save(article);
      this.logger.log(`[INFO] Tags added successfully to article - articleId: ${articleId}, tagsCount: ${tags.length}`);
      return { message: "Tags ajoutés à l'article", article: updatedArticle };
    } catch (error) {
      this.logger.error(`[ERROR] Failed to add tags to article - articleId: ${body.articleId}, error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Supprime des tags d'un article existant (protégé par JWT)
   */
  @Post('remove-tags')
  @UseGuards(JwtAuthGuard)
  async removeTagsFromArticle(
    @Body() body: { articleId: number; tags: string[] },
  ): Promise<{ message: string; article: Article }> {
    try {
      this.logger.log(`[INFO] Removing tags from article - articleId: ${body.articleId}, tags: ${JSON.stringify(body.tags)}`);
      const { articleId, tags } = body;

      const article = await this.articleService.findOne(articleId, ['tags']);
      if (!article) {
        this.logger.warn(`[WARN] Article not found for tag removal - articleId: ${articleId}`);
        throw new Error('Article not found');
      }

      article.tags = (article.tags || []).filter(
        (tag) => !tags.includes(tag.nom),
      );
      const updatedArticle = await this.articleService.save(article);

      this.logger.log(`[INFO] Tags removed successfully from article - articleId: ${articleId}, tagsCount: ${tags.length}`);
      return { message: "Tags retirés de l'article", article: updatedArticle };
    } catch (error) {
      this.logger.error(`[ERROR] Failed to remove tags from article - articleId: ${body.articleId}, error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Crée un nouvel article en précisant les détails comme auteur, école, image, tags (protégé par JWT)
   */
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createArticle(
    @Body()
    body: {
      titre: string;
      contenu: string;
      idAuteur: number;
      id_ecole?: number;
      image?: string;
      tagIds?: number[];
    },
  ): Promise<Article> {
    try {
      this.logger.log(`[INFO] Creating detailed article - title: ${body.titre}, authorId: ${body.idAuteur}, schoolId: ${body.id_ecole || 'none'}`);
      
      const utilisateur = await this.articleService.findAuteur(body.idAuteur);
      if (!utilisateur) {
        this.logger.warn(`[WARN] Author not found for article creation - authorId: ${body.idAuteur}`);
        throw new Error('Auteur not found');
      }

      if (body.image && !body.image.startsWith('http')) {
        this.logger.warn(`[WARN] Invalid image URL provided - authorId: ${body.idAuteur}, imageUrl: ${body.image}`);
        throw new Error('Invalid image URL');
      }

      const ecole = body.id_ecole
        ? await this.schoolService.findOne(body.id_ecole)
        : null;
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

      const article = await this.articleService.create(articleData);
      this.logger.log(`[INFO] Detailed article created successfully - articleId: ${article.idArticle}, authorId: ${body.idAuteur}`);
      return article;
    } catch (error) {
      this.logger.error(`[ERROR] Failed to create detailed article - authorId: ${body.idAuteur}, error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère un article avec son auteur et ses informations liées
   */
  @Post('findWithAuthor')
  async findArticleWithAuthor(@Body() body: { id: number }): Promise<{
    id: number;
    titre: string;
    contenu: string;
    dateCreation: Date;
    utilisateur: string;
    tags: string[];
    nomEcole?: string;
    idEcole?: number;
  }> {
    try {
      this.logger.log(`[INFO] Finding article with author - articleId: ${body.id}`);
      const article = await this.articleService.findOne(body.id, ['utilisateur']);
      if (!article) {
        this.logger.warn(`[WARN] Article not found for author lookup - articleId: ${body.id}`);
        throw new Error('Article not found');
      }

      this.logger.log(`[INFO] Article with author found successfully - articleId: ${body.id}, author: ${article.utilisateur?.prenom} ${article.utilisateur?.nom}`);
      return {
        id: article.idArticle,
        titre: article.titre,
        contenu: article.contenu,
        dateCreation: article.dateCreation,
        utilisateur: article.utilisateur
          ? `${article.utilisateur.prenom} ${article.utilisateur.nom}`
          : null,
        tags: article.tags ? article.tags.map((tag) => tag.nom) : [],
        nomEcole: article?.ecole?.nom ?? null,
        idEcole: article?.ecole?.id ?? null,
      };
    } catch (error) {
      this.logger.error(`[ERROR] Failed to find article with author - articleId: ${body.id}, error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère tous les articles d'un auteur donné
   */
  @Post('findAllByAuthor')
  async findAllByAuthor(@Body() body: { id: number }): Promise<
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
    try {
      this.logger.log(`[INFO] Finding all articles for author - authorId: ${body.id}`);
      const articles = await this.articleService.findByAuthorId(body.id);

      this.logger.log(`[INFO] Articles by author retrieved successfully - authorId: ${body.id}, count: ${articles.length}`);
      return articles.map((article) => ({
        id: article.idArticle,
        titre: article.titre,
        contenu: article.contenu,
        dateCreation: article.dateCreation,
        utilisateur: article.utilisateur
          ? `${article.utilisateur.prenom} ${article.utilisateur.nom}`
          : '',
        tags: article.tags?.map((tag) => tag.nom) || [],
        nomEcole: article.ecole?.nom ?? null,
        idEcole: article.ecole?.id ?? null,
      }));
    } catch (error) {
      this.logger.error(`[ERROR] Failed to find articles by author - authorId: ${body.id}, error: ${error.message}`);
      throw error;
    }
  }
}
