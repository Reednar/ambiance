import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../entity/publications';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class PostsService {
    private baseUrl = `${environment.baseUrl}/publications`;
  
    constructor(private http: HttpClient) {}
  
    getPosts(): Observable<Post[]> {
      return this.http.get<Post[]>(this.baseUrl);
    }
  
    getPostById(id: number): Observable<Post> {
      return this.http.get<Post>(`${this.baseUrl}/${id}`);
    }
  }