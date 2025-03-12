import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = 'http://localhost:3000/api'; // URL du backend NestJS

  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get(`${this.apiUrl}/endpoint`);
  }
}
