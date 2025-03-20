import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3008/api/auth'; // URL de ton backend
  private isConnected = new BehaviorSubject<boolean>(this.isLoggedIn());
  isConnected$ = this.isConnected.asObservable();
  constructor(private http: HttpClient, private router: Router) 
  {}

  isLoggedIn(): boolean {
    // const token = localStorage.getItem('access_token');
    const token = sessionStorage.getItem('access_token');
    console.log('Token:', token);
  
    if (token) {
      const parts = token.split('.'); // Diviser le token par des points
      if (parts.length !== 3) {
        console.error('Token malformé');
        return false; // Si le token n'a pas 3 parties, il est invalide
      }
  
      try {
        const decodedToken: any = jwtDecode(token);
        const expirationDate = decodedToken.exp * 1000; // Convertir en millisecondes
        return expirationDate > Date.now();
      } catch (error) {
        console.error('Erreur de décodage du token', error);
        return false; // Si le décodage échoue, le token est invalide
      }
    }
  
    return false;
  }
  

  login(credentials: { mail: string; password: string }): Observable<any> {
    const { mail, password } = credentials;
    const user = { mail: mail, password };

    return this.http.post<{ access_token: string; refresh_token: string }>(`${this.apiUrl}/login`, user).pipe(
      tap(response => {
        console.log('Réponse du serveur', response);
        console.log('access token lors du login : ', response.access_token);

        this.saveToken(response.access_token, response.refresh_token);
        this.isConnected.next(true);
      })
    );
  }

  saveToken(accessToken: string, refreshToken: string): void {
    console.log('Enregistrement du token dans localStorage', accessToken);
    // localStorage.setItem('access_token', accessToken);
    // localStorage.setItem('refresh_token', refreshToken);
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('refresh_token', refreshToken);
    console.log(localStorage.getItem('access_token'));
  }
  
  getToken(): string | null {
    const token = sessionStorage.getItem('access_token');
    // const token = localStorage.getItem('access_token');
    console.log('Récupération du token depuis localStorage', token);
    return token;
  }

  logout(): void {
    this.removeToken();
    this.isConnected.next(false);
    console.log("isconnected value : " + this.isConnected);
    this.router.navigate(['//login']);
  }
  
  getRefreshToken(): string | null {
    return sessionStorage.getItem('refresh_token');
    // return localStorage.getItem('refresh_token');
  }

  refreshToken() {
    const refreshToken = this.getRefreshToken();
  
    return this.http.post<{ access_token: string }>(
      'http://localhost:3000/auth/refresh',
      { refreshToken }
    ).pipe(
      tap(response => {
        this.saveToken(response.access_token, refreshToken!);
      })
    );
  }

  removeToken(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    // localStorage.removeItem('access_token');
    // localStorage.removeItem('refresh_token');
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes
    return decodedToken.exp < currentTime; // True si le token est expiré
  }
}
