import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = 'http://localhost:3000/api'; // URL du backend NestJS

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/endpoint`); // Remplace `/endpoint` par l'endpoint de ton API
  }
}
