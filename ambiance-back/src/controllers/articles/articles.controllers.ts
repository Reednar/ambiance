import { Controller, Get, Post, Body, Param, Delete, Logger } from '@nestjs/common';
import { ArticleService } from '../../services/articles/articles.services';
import { Article } from '../../entities/articles.entity';
import { TagService } from '../../services/tags/tags.service'; // Ajoute l'import
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/users.entity';


@Controller('articles')
export class ArticlesController {
  private readonly logger = new Logger(ArticlesController.name);

  constructor(
    private readonly articleService: ArticleService,
    private readonly tagService: TagService
  ) {}

  @Post()
  create(@Body() data: any): Promise<Article> {
    this.logger.log('Creating article', data);
    return this.articleService.create(data);
  }

  @Post('findOne')
  async findOne(@Body() body: { id: number }): Promise<Article> {
    this.logger.log(`Finding article with id: ${body.id}`);
    return this.articleService.findOne(body.id);
  }

  @Post('delete')
  async remove(@Body() body: { id: number }): Promise<void> {
    this.logger.log(`Deleting article with id: ${body.id}`);
    return this.articleService.remove(body.id);
  }

  
  @Post('list')
  async getArticlesWithAuthorAndTags(): Promise<
    { id: number; DateCreation: Date; utilisateur: string; tags: string[] }[]
  > {
    this.logger.log('Fetching all articles with authors and tags');
    const articles = await this.articleService.findAllWithAuthorAndTags();
    return articles.map(article => ({
      id: article.IdArticle,
      DateCreation: article.DateCreation,
      utilisateur: article.utilisateur ? `${article.utilisateur.prenom} ${article.utilisateur.nom}` : null,
      tags: article.tags ? article.tags.map(tag => tag.Nom) : [],
    }));
  }

  @Post('tags')
  async getAllTags(): Promise<{ id: number; nom: string }[]> {
    this.logger.log('Fetching all tags');
    const tags = await this.tagService.findAll();
    return tags.map(tag => ({
      id: tag.IdTag,
      nom: tag.Nom,
    }));
  }

  @Post('add-tags')
  async addTagsToArticle(
    @Body() body: { articleId: number; tags: string[] }
  ): Promise<{ message: string; article: Article }> {
    this.logger.log(`Adding tags to article ${body.articleId}: ${body.tags}`);
    const { articleId, tags } = body;

    // Charge l'article avec ses tags
    const article = await this.articleService.findOne(articleId, ['tags']);
    if (!article) {
      this.logger.error(`Article not found: ${articleId}`);
      throw new Error('Article not found');
    }

    article.tags = article.tags || [];
    for (const tagName of tags) {
      let tag = await this.tagService.create(tagName);
      if (!article.tags.find(t => t.IdTag === tag.IdTag)) {
        article.tags.push(tag);
      }
    }

    // Sauvegarde l'article avec les nouveaux tags
    const updatedArticle = await this.articleService.save(article);

    this.logger.log(`Tags added to article ${articleId}`);
    return { message: 'Tags ajoutés à l\'article', article: updatedArticle };
  }

  @Post('remove-tags')
  async removeTagsFromArticle(
    @Body() body: { articleId: number; tags: string[] }
  ): Promise<{ message: string; article: Article }> {
    this.logger.log(`Removing tags from article ${body.articleId}: ${body.tags}`);
    const { articleId, tags } = body;

    // Charge l'article avec ses tags
    const article = await this.articleService.findOne(articleId, ['tags']);
    if (!article) {
      this.logger.error(`Article not found: ${articleId}`);
      throw new Error('Article not found');
    }

    article.tags = (article.tags || []).filter(
      tag => !tags.includes(tag.Nom)
    );

    // Sauvegarde l'article avec les tags mis à jour
    const updatedArticle = await this.articleService.save(article);

    this.logger.log(`Tags removed from article ${articleId}`);
    return { message: 'Tags retirés de l\'article', article: updatedArticle };
  }

  @Post('create')
  async createArticle(
    @Body() body: {
      Titre: string;
      contenu: string;
      idAuteur: number;
      id_ecole?: number;
    }
  ): Promise<Article> {
    this.logger.log(`Creating article with title: ${body.Titre} by author: ${body.idAuteur}`);
    const utilisateur = await this.articleService.findAuteur(body.idAuteur);
    if (!utilisateur) {
      this.logger.error(`Auteur not found: ${body.idAuteur}`);
      throw new Error('Auteur not found');
    }

    const articleData: Partial<Article> = {
      Titre: body.Titre,
      Contenu: body.contenu,
      utilisateur: utilisateur,
      DateCreation: new Date(),
      ...(body.id_ecole ? { ecole: { id: body.id_ecole } } : {}),
    };

    return await this.articleService.create(articleData);
  }

  @Post('findWithAuthor')
  async findArticleWithAuthor(
    @Body() body: { id: number }
  ): Promise<{ id: number; Titre: string; contenu: string; DateCreation: Date; utilisateur: string; tags: string[] }> {
    this.logger.log(`Finding article with author for id: ${body.id}`);
    const article = await this.articleService.findOne(body.id, ['utilisateur']);
    if (!article) {
      this.logger.error(`Article not found: ${body.id}`);
      throw new Error('Article not found');
    }
    return {
      id: article.IdArticle,
      Titre: article.Titre,
      contenu: article.Contenu,
      DateCreation: article.DateCreation,
      utilisateur: article.utilisateur ? `${article.utilisateur.prenom} ${article.utilisateur.nom}` : null,
      tags: article.tags ? article.tags.map(tag => tag.Nom) : [],
    };
  }
}
