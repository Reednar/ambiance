import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.baseUrl}/auth`; // URL de ton backend
  private isConnected = new BehaviorSubject<boolean>(this.isLoggedIn());
  isConnected$ = this.isConnected.asObservable();
  constructor(private http: HttpClient, private router: Router) { }

  isLoggedIn(): boolean {
    // const token = localStorage.getItem('access_token');
    const token = sessionStorage.getItem('access_token');
    if (token) {
      const parts = token.split('.'); // Diviser le token par des points
      if (parts.length !== 3) {
        return false; // Si le token n'a pas 3 parties, il est invalide
      }

      try {
        const decodedToken: any = jwtDecode(token);
        const expirationDate = decodedToken.exp * 1000; // Convertir en millisecondes
        return expirationDate > Date.now();
      } catch (error) {
        return false; // Si le décodage échoue, le token est invalide
      }
    }

    return false;
  }


  login(credentials: { mail: string; password: string }): Observable<any> {
    const { mail, password } = credentials;
    const user = { mail: mail, password };

    return this.http.post<{ access_token: string; refresh_token: string; idUtilisateur: string }>(`${this.apiUrl}/login`, user).pipe(
      tap(response => {
        this.saveToken(response.access_token, response.refresh_token);
        sessionStorage.setItem('id_utilisateur', response.idUtilisateur);
        this.isConnected.next(true);
      })
    );
  }

  saveToken(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('refresh_token', refreshToken);
  }

  getToken(): string | null {
    const token = sessionStorage.getItem('access_token');
    return token;
  }

  logout(): void {
    this.removeToken();
    sessionStorage.removeItem('id_utilisateur');
    this.isConnected.next(false);
    this.router.navigate(['/login']);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem('refresh_token');
  }


  removeToken(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes
    return decodedToken.exp < currentTime; // True si le token est expiré
  }

  refreshToken(): Observable<{ access_token: string }> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<{ access_token: string }>(`${environment.baseUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          const newAccessToken = response.access_token;
          sessionStorage.setItem('access_token', newAccessToken);
        }),
        catchError(error => {
          console.error('Erreur lors du rafraîchissement du token', error);
          return throwError(() => new Error('Erreur lors du rafraîchissement du token'));
        })
      );

  }

}