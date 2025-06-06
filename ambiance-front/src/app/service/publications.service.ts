import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PublicationsService {
  // URL de base pour accéder à l'API publications, issue des variables d'environnement
  private url = `${environment.baseUrl}/publications`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les publications
   * @returns Observable contenant la liste des publications
   */
  getAll(): Observable<any> {
    return this.http.get(this.url);
  }

  /**
   * Récupère une publication spécifique par son identifiant
   * @param id Identifiant de la publication
   * @returns Observable contenant la publication correspondante
   */
  getOne(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }

  /**
   * Crée une nouvelle publication
   * @param data Données de la nouvelle publication
   * @returns Observable avec la réponse de la création
   * Note : la requête inclut les cookies (authentification)
   */
  create(data: any): Observable<any> {
    return this.http.post(`${this.url}/create`, data, {
      withCredentials: true,
    });
  }

  /**
   * Met à jour une publication existante
   * @param data Données de la publication à mettre à jour
   * @returns Observable avec la réponse de la mise à jour
   */
  update(data: any): Observable<any> {
    return this.http.post(`${this.url}/update`, data);
  }

  /**
   * Supprime une publication
   * @param data Objet contenant l'id de la publication et l'id de l'utilisateur
   * @returns Observable avec la réponse de la suppression
   */
  delete(data: { idPublication: number; utilisateurId: number }): Observable<any> {
    return this.http.post(`${this.url}/delete`, data, {
      withCredentials: true,
    });
  }

  /**
   * Exemple d'accès à une route protégée (test)
   * @returns Observable avec la réponse de la route protégée
   */
  getProtected(): Observable<any> {
    return this.http.get(`${this.url}/test`);
  }

  /**
   * Récupère toutes les publications d'un utilisateur spécifique
   * @param id Identifiant de l'utilisateur
   * @returns Observable contenant la liste des publications de l'utilisateur
   */
  getPublicationsByUser(id: number): Observable<any> {
    return this.http.get(`${this.url}/user/${id}`);
  }

  /**
   * Récupère la liste des écoles accessibles par un utilisateur
   * @param userId Identifiant de l'utilisateur
   * @returns Observable contenant un tableau d'objets écoles { id, nom }
   */
  getAccessibleSchools(userId: number): Observable<{ id: number; nom: string }[]> {
    return this.http.post<{ id: number; nom: string }[]>(`${this.url}/accessible-ecoles`, { userId });
  }

  /**
   * Récupère le nombre total de publications
   * @returns Observable contenant le nombre de publications
   */
  count(): Observable<number> {
    return this.http.get<number>(`${this.url}/count`);
  }
}
