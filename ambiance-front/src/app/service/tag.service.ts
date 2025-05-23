import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ecole } from '../entity/ecole';
import { User } from '../entity/users';
import { Article } from '../entity/article';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private baseUrl = `${environment.baseUrl}/articles`;

  constructor(private http: HttpClient) {}

  create(data: any): Observable<Article> {
    return this.http.post<Article>(`${this.baseUrl}`, data, { withCredentials: true });
  }

  findOne(id: number): Observable<Article> {
    return this.http.post<Article>(`${this.baseUrl}/findOne`, { id });
  }

  delete(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/delete`, { id }, { withCredentials: true });
  }

  list(): Observable<{ id: number; dateCreation: Date; utilisateur: string; tags: string[]; image: string; nomEcole: string, contenu: string }[]> {
    return this.http.post<any[]>(`${this.baseUrl}/list`, {});
  }

  getAllTags(): Observable<{ id: number; nom: string }[]> {
    return this.http.post<any[]>(`${this.baseUrl}/tags`, {});
  }

  addTagsToArticle(articleId: number, tags: string[]): Observable<{ message: string; article: Article }> {
    return this.http.post<any>(`${this.baseUrl}/add-tags`, { articleId, tags }, { withCredentials: true });
  }

  removeTagsFromArticle(articleId: number, tags: string[]): Observable<{ message: string; article: Article }> {
    return this.http.post<any>(`${this.baseUrl}/remove-tags`, { articleId, tags }, { withCredentials: true });
  }

  createArticle(articleData: {
    Titre: string;
    contenu: string;
    idAuteur: number;
    id_ecole?: number;
    Image?: string;
  }): Observable<Article> {
    return this.http.post<Article>(`${this.baseUrl}/create`, articleData, { withCredentials: true });
  }

  findArticleWithAuthor(id: number): Observable<{
    id: number;
    Titre: string;
    contenu: string;
    DateCreation: Date;
    utilisateur: string;
    tags: string[];
  }> {
    return this.http.post<any>(`${this.baseUrl}/findWithAuthor`, { id });
  }

  updateArticle(articleUpdate: {
    id: number;
    Titre?: string;
    contenu?: string;
    Image?: string;
  }): Observable<Article> {
    return this.http.post<Article>(`${this.baseUrl}/update`, articleUpdate, { withCredentials: true });
  }
}
