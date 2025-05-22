import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PublicationsService {
  private url = `${environment.baseUrl}/publications`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.url);
  }

  getOne(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }

create(data: any): Observable<any> {
  return this.http.post(`${this.url}/create`, data, {
    withCredentials: true,
  });
}


  update(data: any): Observable<any> {
    return this.http.post(`${this.url}/update`, data);
  }

  delete(data: { idPublication: number, utilisateurId: number }): Observable<any> {
    return this.http.post(`${this.url}/delete`, data);
  }

  getProtected(): Observable<any> {
    return this.http.get(`${this.url}/test`);
  }

  getPublicationsByUser(id: number): Observable<any> {
    return this.http.get(`${this.url}/user/${id}`);
  }

  getAccessibleSchools(userId: number): Observable<{ id: number; nom: string }[]> {
    return this.http.post<{ id: number; nom: string }[]>(`${this.url}/accessible-ecoles`, { userId });
  }
}
