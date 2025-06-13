import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  // URL de base pour accéder à l'API des catégories
  private url = `${environment.baseUrl}/categories`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de toutes les catégories.
   * @returns Observable contenant un tableau des catégories (type any à préciser)
   */
  findAll(): Observable<any> {
    return this.http.get(this.url);
  }

  /**
   * Récupère une catégorie par son identifiant.
   * @param id Identifiant de la catégorie recherchée
   * @returns Observable contenant la catégorie (type any à préciser)
   */
  findOne(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }

  /**
   * Récupère une catégorie par son identifiant au format DTO (Data Transfer Object).
   * @param id Identifiant de la catégorie
   * @returns Observable contenant le DTO de la catégorie (type any à préciser)
   */
  findOneDto(id: number): Observable<any> {
    return this.http.get(`${this.url}/dto/${id}`);
  }

  /**
   * Crée une nouvelle catégorie avec les données fournies.
   * @param data Objet contenant le nom de la catégorie
   * @returns Observable contenant la catégorie créée (type any à préciser)
   */
  create(data: { nom: string }): Observable<any> {
    return this.http.post(this.url, data);
  }

  /**
   * Met à jour une catégorie existante.
   * @param id Identifiant de la catégorie à mettre à jour
   * @param data Objet contenant les nouvelles données de la catégorie
   * @returns Observable contenant la catégorie mise à jour (type any à préciser)
   */
  update(id: number, data: { nom: string }): Observable<any> {
    return this.http.put(`${this.url}/${id}`, data);
  }

  /**
   * Supprime une catégorie par son identifiant.
   * @param id Identifiant de la catégorie à supprimer
   * @returns Observable vide ou confirmation de suppression (type any à préciser)
   */
  remove(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
