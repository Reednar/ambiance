import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  private url = `${environment.baseUrl}/groups`;

  constructor(private readonly http: HttpClient) { }

  // POST /groups/findAll
  findAll(userId: number): Observable<any> {
    return this.http.post(`${this.url}/findAll`, { userId });
  }

  // POST /groups/create
  createGroup(data: { nomDuGroupe: string; utilisateurId: number; idPublication: number }): Observable<any> {
    return this.http.post(`${this.url}/create`, data);
  }

  // POST /groups/addUser
  addUserToGroup(data: { idPublication: number; idUtilisateur: number }): Observable<any> {
    return this.http.post(`${this.url}/addUser`, data, {
      withCredentials: true
    });
  }


  // POST /groups/removeUser
  removeUserFromGroup(data: { IdGroupe: number; IdUtilisateur: number; senderId: number }): Observable<any> {
    return this.http.post(`${this.url}/removeUser`, data);
  }

  // POST /groups/changeOrganisateur
  changeOrganisateur(data: { IdGroupe: number; IdUtilisateur: number }): Observable<any> {
    return this.http.post(`${this.url}/changeOrganisateur`, data);
  }

  // POST /groups/userGroups
  getUserGroups(IdUtilisateur: number): Observable<any> {
    return this.http.post(`${this.url}/userGroups`, { IdUtilisateur });
  }

  // POST /groups/groupUsers
  getUsersInGroup(IdGroupe: number): Observable<any> {
    return this.http.post(`${this.url}/groupUsers`, { IdGroupe });
  }

  // POST /groups/addUser
  hasJoined(data: { idPublication: number; idUtilisateur: number }): Observable<any> {
    return this.http.post(`${this.url}/has-joined`, data);
  }

}
