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
  private baseUrl = `${environment.baseUrl}/schools`;

  constructor(private http: HttpClient) {}

  
  updateSchool(id: number, data: Partial<Ecole> & { allowed_domain?: string[] }): Observable<Ecole> {
    return this.http.post<Ecole>(`${this.baseUrl}/update`, { id, data });
  }

  deleteSchool(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/delete`, { id });
  }

  findSchool(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/find`, { id });
  }

  findAllSchools(): Observable<Ecole[]> {
    return this.http.post<Ecole[]>(`${this.baseUrl}/findAll`, {});
  }

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

  addMemberToBDE(body: { idUtilisateur: number; idEcole: number; email: string }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/addMember`, body);
  }

  getPendingMembers(body: { idEcole: number; idCreateur: number }): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/getPendingMembers`, body);
  }

  updateMemberStatus(body: { idEcole: number; idCreateur: number; idUtilisateur: number }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/updateMemberStatus`, body);
  }

  removeMemberFromBDE(body: { idEcole: number; idCreateur: number; idUtilisateur: number }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/removeMember`, body);
  }

  getUsersBySchool(body: { idEcole: number }): Observable<User[]> {
    return this.http.post<User[]>(`${this.baseUrl}/getUsersBySchool`, body);
  }

  // getMembersBySchool(body: { idEcole: number }): Observable<MembresBDE[]> {
  //   return this.http.post<MembresBDE[]>(`${this.baseUrl}/getMembersBySchool`, body);
  // }

  changeSchoolCreator(body: { idEcole: number; newCreatorId: number }): Observable<Ecole> {
    return this.http.post<Ecole>(`${this.baseUrl}/changeCreator`, body);
  }

   findSchoolByUserId(userId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/by-user`, { userId });
  }
}
