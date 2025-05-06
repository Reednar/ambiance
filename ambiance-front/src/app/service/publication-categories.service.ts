import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PublicationCategoriesService {
  private url = `${environment.baseUrl}/publication-categories`;

  constructor(private http: HttpClient) {}

  addCategoryToPublication(IdPublication: number, IdCategorie: number): Observable<any> {
    return this.http.post(`${this.url}/${IdPublication}/${IdCategorie}`, {});
  }

  removeCategoryFromPublication(IdPublication: number, IdCategorie: number): Observable<any> {
    return this.http.delete(`${this.url}/${IdPublication}/${IdCategorie}`);
  }

  getCategoriesByPublication(IdPublication: number): Observable<any> {
    return this.http.get(`${this.url}/publication/${IdPublication}`);
  }

  getPublicationsByCategorie(IdCategorie: number): Observable<any> {
    return this.http.get(`${this.url}/categorie/${IdCategorie}`);
  }
}
