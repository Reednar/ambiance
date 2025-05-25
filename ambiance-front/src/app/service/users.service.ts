import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../entity/users';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private url = `${environment.baseUrl}/users`;
  private userId = sessionStorage.getItem('id_utilisateur');

  constructor(private http: HttpClient) { }

  // Récupérer tous les utilisateurs
  getUsers(): Observable<User[]> {
    return this.http.post<User[]>(this.url + "/findAll", this.userId);
  }

  // Récupérer un utilisateur par ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  // Créer un utilisateur
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.url + "/create", user);
  }

  // Mettre à jour un utilisateur (avec formData)
  updateUser(id: number, formData: FormData): Observable<User> {
    return this.http.put<User>(`${this.url}/${id}`, formData, { withCredentials: true });
  }

  // Supprimer un utilisateur
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // Validation d'un utilisateur
  validateUserWithToken(token: string) {
    return this.http.post(`${this.url}/validate`, { token });
  }

  //  Renvoie du mail de confirmation de compte
  resendConfirmationEmail(id: string) {
    return this.http.post(
      `${this.url}/resend-confirmation-email`,
      { id },
      { withCredentials: true }
    );
  }

  // Envoie du mail MDP oublié
  forgotPassword(mail: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.url}/forgot-password`,
      { mail }
    );
  }

  // Envoie du nouveau MDP en BDD avec le token
  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.url}/reset-password`,
      { token, newPassword }
    );
  }
}
