import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PublicationCategoriesService {
  // URL de base pour accéder à l'API des catégories de publications
  private url = `${environment.baseUrl}/publication-categories`;

  constructor(private http: HttpClient) {}

  /**
   * Ajoute une catégorie à une publication donnée
   * @param IdPublication Identifiant de la publication
   * @param IdCategorie Identifiant de la catégorie à ajouter
   * @returns Observable avec la réponse de l'ajout
   */
  addCategoryToPublication(IdPublication: number, IdCategorie: number): Observable<any> {
    return this.http.post(`${this.url}/${IdPublication}/${IdCategorie}`, {});
  }

  /**
   * Supprime une catégorie d'une publication donnée
   * @param IdPublication Identifiant de la publication
   * @param IdCategorie Identifiant de la catégorie à retirer
   * @returns Observable avec la réponse de la suppression
   */
  removeCategoryFromPublication(IdPublication: number, IdCategorie: number): Observable<any> {
    return this.http.delete(`${this.url}/${IdPublication}/${IdCategorie}`);
  }

  /**
   * Récupère toutes les catégories associées à une publication spécifique
   * @param IdPublication Identifiant de la publication
   * @returns Observable contenant la liste des catégories
   */
  getCategoriesByPublication(IdPublication: number): Observable<any> {
    return this.http.get(`${this.url}/publication/${IdPublication}`);
  }

  /**
   * Récupère toutes les publications associées à une catégorie spécifique
   * @param IdCategorie Identifiant de la catégorie
   * @returns Observable contenant la liste des publications
   */
  getPublicationsByCategorie(IdCategorie: number): Observable<any> {
    return this.http.get(`${this.url}/categorie/${IdCategorie}`);
  }
}
