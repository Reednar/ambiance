import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Article } from '../models/article';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  // URL de base pour accéder aux articles via l'API
  private baseUrl = `${environment.baseUrl}/articles`;

  constructor(private http: HttpClient) { }

  /**
   * Crée un nouvel article
   * @param data Données de l'article à créer
   * @returns Observable de l'article créé
   */
  create(data: any): Observable<Article> {
    return this.http.post<Article>(`${this.baseUrl}`, data, { withCredentials: true });
  }

  /**
   * Récupère un article par son identifiant
   * @param id Identifiant de l'article
   * @returns Observable de l'article correspondant
   */
  findOne(id: number): Observable<Article> {
    return this.http.post<Article>(`${this.baseUrl}/findOne`, { id });
  }

  /**
   * Supprime un article par son identifiant
   * @param id Identifiant de l'article à supprimer
   * @returns Observable vide (void)
   */
  delete(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/delete`, { id }, { withCredentials: true });
  }

  /**
   * Liste tous les articles avec des champs spécifiques
   * @returns Observable d'un tableau d'articles simplifiés
   */
  list(): Observable<{ id: number; dateCreation: Date; utilisateur: string; tags: string[]; image: string; nomEcole: string, contenu: string }[]> {
    return this.http.post<any[]>(`${this.baseUrl}/list`, {});
  }

  /**
   * Récupère tous les tags disponibles
   * @returns Observable d'un tableau de tags (id et nom)
   */
  getAllTags(): Observable<{ id: number; nom: string }[]> {
    return this.http.post<any[]>(`${this.baseUrl}/tags`, {});
  }

  /**
   * Ajoute des tags à un article existant
   * @param articleId Identifiant de l'article
   * @param tags Liste des tags à ajouter
   * @returns Observable avec message et article mis à jour
   */
  addTagsToArticle(articleId: number, tags: string[]): Observable<{ message: string; article: Article }> {
    return this.http.post<any>(`${this.baseUrl}/add-tags`, { articleId, tags }, { withCredentials: true });
  }

  /**
   * Supprime des tags d'un article existant
   * @param articleId Identifiant de l'article
   * @param tags Liste des tags à retirer
   * @returns Observable avec message et article mis à jour
   */
  removeTagsFromArticle(articleId: number, tags: string[]): Observable<{ message: string; article: Article }> {
    return this.http.post<any>(`${this.baseUrl}/remove-tags`, { articleId, tags }, { withCredentials: true });
  }

  /**
   * Crée un nouvel article avec des données spécifiques
   * @param articleData Données de l'article (titre, contenu, auteur, école, image)
   * @returns Observable de l'article créé
   */
  createArticle(articleData: {
    Titre: string;
    contenu: string;
    idAuteur: number;
    id_ecole?: number;
    Image?: string;
  }): Observable<Article> {
    return this.http.post<Article>(`${this.baseUrl}/create`, articleData, { withCredentials: true });
  }

  /**
   * Récupère un article avec les informations de son auteur
   * @param id Identifiant de l'article
   * @returns Observable d'un objet contenant article + auteur + tags
   */
  findArticleWithAuthor(id: number): Observable<{
    id: number;
    Titre: string;
    contenu: string;
    DateCreation: Date;
    utilisateur: string;
    tags: string[];
  }> {
    return this.http.post<any>(`${this.baseUrl}/findWithAuthor`, { id });
  }

  /**
   * Met à jour un article avec les nouvelles données fournies
   * @param articleUpdate Objet avec id de l'article et champs à mettre à jour
   * @returns Observable de l'article mis à jour
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
