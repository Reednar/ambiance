import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private url = `${environment.baseUrl}/ecoles`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<any> {
    return this.http.get(this.url);
  }

  findOne(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }

  findOneDto(id: number): Observable<any> {
    return this.http.get(`${this.url}/dto/${id}`);
  }

  create(data: { nom: string }): Observable<any> {
    return this.http.post(this.url, data);
  }

  update(id: number, data: { nom: string }): Observable<any> {
    return this.http.put(`${this.url}/${id}`, data);
  }

  remove(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
