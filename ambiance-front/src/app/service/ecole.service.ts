import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ecole } from '../entity/ecole';
import { User } from '../entity/users';

@Injectable({
  providedIn: 'root',
})
export class EcoleService {
  // URL de base pour accéder à l'API des écoles
  private baseUrl = `${environment.baseUrl}/schools`;

  constructor(private http: HttpClient) {}

  /**
   * Met à jour une école avec les données fournies.
   * @param id Identifiant de l'école à modifier
   * @param data Données partielles de l'école à mettre à jour, incluant optionnellement allowed_domain
   * @returns Observable contenant l'école mise à jour
   */
  updateSchool(id: number, data: Partial<Ecole> & { allowed_domain?: string[] }): Observable<Ecole> {
    return this.http.post<Ecole>(`${this.baseUrl}/update`, { id, data });
  }

  /**
   * Supprime une école identifiée par son id.
   * @param id Identifiant de l'école à supprimer
   * @returns Observable vide (void)
   */
  deleteSchool(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/delete`, { id });
  }

  /**
   * Recherche une école par son identifiant.
   * @param id Identifiant de l'école recherchée
   * @returns Observable contenant les détails de l'école (type any, à affiner)
   */
  findSchool(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/find`, { id });
  }

  /**
   * Récupère la liste de toutes les écoles.
   * @returns Observable contenant un tableau d'écoles
   */
  findAllSchools(): Observable<Ecole[]> {
    return this.http.post<Ecole[]>(`${this.baseUrl}/findAll`, {});
  }

  /**
   * Crée une nouvelle école avec les informations fournies.
   * @param body Objet contenant les informations nécessaires à la création d'une école
   * @returns Observable contenant l'école créée
   */
  createSchool(body: {
    idUtilisateur: number;
    nom: string;
    site_web?: string;
    telephone?: string;
    description?: string;
    ville: string;
    codePostal: string;
    rue: string;
    contact_email: string;
    type_ecole: string;
    allowed_domain?: string[];
  }): Observable<Ecole> {
    return this.http.post<Ecole>(`${this.baseUrl}/create`, body);
  }

  /**
   * Ajoute un membre au BDE (Bureau des Étudiants) d'une école.
   * @param body Contient l'id de l'utilisateur, l'id de l'école et l'email du membre à ajouter
   * @returns Observable vide (void)
   */
  addMemberToBDE(body: { idUtilisateur: number; idEcole: number; email: string }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/addMember`, body);
  }

  /**
   * Récupère la liste des membres en attente de validation pour le BDE d'une école.
   * @param body Contient l'id de l'école et l'id du créateur (responsable)
   * @returns Observable contenant un tableau des membres en attente (type any[], à préciser)
   */
  getPendingMembers(body: { idEcole: number; idCreateur: number }): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/getPendingMembers`, body);
  }

  /**
   * Met à jour le statut d'un membre du BDE (ex : validation ou refus).
   * @param body Contient idEcole, idCreateur et idUtilisateur du membre à modifier
   * @returns Observable vide (void)
   */
  updateMemberStatus(body: { idEcole: number; idCreateur: number; idUtilisateur: number }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/updateMemberStatus`, body);
  }

  /**
   * Supprime un membre du BDE d'une école.
   * @param body Contient idEcole, idCreateur et idUtilisateur du membre à supprimer
   * @returns Observable vide (void)
   */
  removeMemberFromBDE(body: { idEcole: number; idCreateur: number; idUtilisateur: number }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/removeMember`, body);
  }

  /**
   * Récupère tous les utilisateurs liés à une école donnée.
   * @param body Contient l'id de l'école
   * @returns Observable contenant un tableau d'utilisateurs
   */
  getUsersBySchool(body: { idEcole: number }): Observable<User[]> {
    return this.http.post<User[]>(`${this.baseUrl}/getUsersBySchool`, body);
  }

  /*
   * Méthode commentée qui pourrait récupérer les membres BDE par école
   * getMembersBySchool(body: { idEcole: number }): Observable<MembresBDE[]> {
   *   return this.http.post<MembresBDE[]>(`${this.baseUrl}/getMembersBySchool`, body);
   * }
   */

  /**
   * Change le créateur (responsable) d'une école.
   * @param body Contient l'id de l'école et l'id du nouveau créateur
   * @returns Observable contenant l'école mise à jour
   */
  changeSchoolCreator(body: { idEcole: number; newCreatorId: number }): Observable<Ecole> {
    return this.http.post<Ecole>(`${this.baseUrl}/changeCreator`, body);
  }

  /**
   * Trouve une école associée à un utilisateur donné.
   * @param userId Identifiant de l'utilisateur
   * @returns Observable contenant l'école correspondante (type any, à préciser)
   */
  findSchoolByUserId(userId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/by-user`, { userId });
  }
}
