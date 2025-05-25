import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Article, Tags } from '../entity/article';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  // URL de base pour accéder à l'API des articles
  private baseUrl = `${environment.baseUrl}/articles`;

  constructor(private http: HttpClient) {}

  /**
   * Crée un nouvel article avec les données fournies.
   * @param data Objet contenant les données de l'article (type any, à préciser si possible)
   * @returns Observable contenant l'article créé
   */
  create(data: any): Observable<Article> {
    return this.http.post<Article>(`${this.baseUrl}`, data, { withCredentials: true });
  }

  /**
   * Récupère un article spécifique en fonction de son identifiant.
   * @param id Identifiant de l'article
   * @returns Observable contenant l'article demandé
   */
  findOne(id: number): Observable<Article> {
    return this.http.post<Article>(`${this.baseUrl}/findOne`, { id });
  }

  /**
   * Supprime un article par son identifiant.
   * @param id Identifiant de l'article à supprimer
   * @returns Observable vide indiquant la suppression
   */
  delete(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/delete`, { id }, { withCredentials: true });
  }

  /**
   * Récupère la liste de tous les articles avec certaines informations spécifiques.
   * @returns Observable d'un tableau contenant des données comme id, dateCreation, utilisateur, tags, image, nomEcole, contenu
   */
  list(): Observable<{ id: number; dateCreation: Date; utilisateur: string; tags: Tags[]; image: string; nomEcole: string; contenu: string }[]> {
    return this.http.post<any[]>(`${this.baseUrl}/list`, {});
  }

  /**
   * Récupère tous les tags disponibles pour les articles.
   * @returns Observable d'un tableau d'objets tags (id et nom)
   */
  getAllTags(): Observable<{ id: number; nom: string }[]> {
    return this.http.post<any[]>(`${this.baseUrl}/tags`, {});
  }

  /**
   * Ajoute des tags à un article donné.
   * @param articleId Identifiant de l'article
   * @param tags Liste des noms de tags à ajouter
   * @returns Observable contenant un message et l'article mis à jour
   */
  addTagsToArticle(articleId: number, tags: string[]): Observable<{ message: string; article: Article }> {
    return this.http.post<any>(`${this.baseUrl}/add-tags`, { articleId, tags }, { withCredentials: true });
  }

  /**
   * Supprime des tags d'un article donné.
   * @param articleId Identifiant de l'article
   * @param tags Liste des noms de tags à retirer
   * @returns Observable contenant un message et l'article mis à jour
   */
  removeTagsFromArticle(articleId: number, tags: string[]): Observable<{ message: string; article: Article }> {
    return this.http.post<any>(`${this.baseUrl}/remove-tags`, { articleId, tags }, { withCredentials: true });
  }

  /**
   * Crée un nouvel article avec des données précises.
   * @param articleData Objet contenant titre, contenu, idAuteur, id_ecole, et optionnellement image et tagIds
   * @returns Observable contenant l'article créé
   */
  createArticle(articleData: {
    titre: string;
    contenu: string;
    idAuteur: number;
    id_ecole: number;
    image?: string;
    tagIds?: number[];
  }): Observable<Article> {
    return this.http.post<Article>(`${this.baseUrl}/create`, articleData, { withCredentials: true });
  }

  /**
   * Trouve un article avec les informations de son auteur.
   * @param id Identifiant de l'article
   * @returns Observable d'un tableau d'articles (en général un seul)
   */
  findArticleWithAuthor(id: number): Observable<Article[]> {
    return this.http.post<any>(`${this.baseUrl}/findWithAuthor`, { id });
  }

  /**
   * Récupère tous les articles écrits par un auteur spécifique.
   * @param id Identifiant de l'auteur
   * @returns Observable d'un tableau d'articles
   */
  findAllByAuthor(id: number): Observable<Article[]> {
    return this.http.post<any>(`${this.baseUrl}/findAllByAuthor`, { id });
  }

  /**
   * Met à jour un article existant avec les nouvelles données fournies.
   * @param articleUpdate Objet contenant l'id de l'article à mettre à jour, et les champs optionnels à modifier (Titre, contenu, Image)
   * @returns Observable contenant l'article mis à jour
   */
  updateArticle(articleUpdate: {
    id: number;
    Titre?: string;
    contenu?: string;
    Image?: string;
  }): Observable<Article> {
    return this.http.post<Article>(`${this.baseUrl}/update`, articleUpdate, { withCredentials: true });
  }
}
