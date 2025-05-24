import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
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

  private emailConfirmed = new BehaviorSubject<boolean>(this.isLoggedIn());
  emailConfirmed$ = this.emailConfirmed.asObservable();

  constructor(private http: HttpClient, private router: Router) { 
    this.isAuthenticated();
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;  // Token invalide
      }

      try {
        const decodedToken: any = jwtDecode(token);
        const expirationDate = decodedToken.exp * 1000; // Convertir en millisecondes
        return expirationDate > Date.now();  // Vérifie si le token est expiré
      } catch (error) {
        return false;  // Token invalide
      }
    }
    return false;
  }

login(credentials: { mail: string; password: string }): Observable<{ success: boolean; userId: string, emailConfirmed: boolean }> {
  const { mail, password } = credentials;
  const user = { mail, password };

  return this.http.post<{ success: boolean; userId: string; emailConfirmed: boolean }>(
    `${this.apiUrl}/login`,
    user,
    { withCredentials: true }  // Assurez-vous que cette option est active pour envoyer les cookies
  ).pipe(
    tap(response => {
      // Si la connexion est réussie
      if (response.success) {
        // Stocker l'ID utilisateur dans le sessionStorage
        sessionStorage.setItem('id_utilisateur', response.userId);

        // Mettre à jour l'état de la connexion
        this.isConnected.next(true);
        if(response.emailConfirmed == true){
          this.emailConfirmed.next(true);
        }
        else{
          this.emailConfirmed.next(false);
        }
      }
    }),
    catchError(error => {
      console.error('Erreur de connexion:', error);
      return throwError(() => new Error('Erreur de connexion'));
    })
  );
}




  getToken(): string | null {
    // Récupère le token depuis les cookies (géré par le backend)
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1];
    return token || null;
  }

  // logout(): void {
  //   this.removeToken();
  //   document.cookie = 'access_token=; Max-Age=0; Path=/';
  //   document.cookie = 'refresh_token=; Max-Age=0; Path=/';
  //   this.isConnected.next(false);
  //   this.router.navigate(['/login']);
  // }

  logout(): Observable<void> {
  return this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
    tap(() => {
      this.isConnected.next(false);
      this.emailConfirmed.next(false);
      sessionStorage.removeItem('id_utilisateur');
      this.router.navigate(['/login']);
    }),
    catchError(error => {
      console.error('Erreur lors de la déconnexion:', error);
      return throwError(() => new Error('Erreur de déconnexion'));
    })
  );
}


  removeToken(): void {
    document.cookie = 'access_token=; Max-Age=0; path=/'; // Effacer le cookie
    document.cookie = 'refresh_token=; Max-Age=0; path=/'; // Effacer le cookie
  }

// refreshToken(): Observable<{ access_token: string }> {
//   const refreshToken = this.getRefreshToken();

//   // Vérifie si le refresh token existe avant d'envoyer la requête
//   if (!refreshToken) {
//     return throwError(() => new Error('No refresh token available'));
//   }

//   return this.http.post<{ access_token: string }>(`${environment.baseUrl}/auth/refresh`, { refreshToken }).pipe(
//     tap(response => {
//       const newAccessToken = response.access_token;
//       sessionStorage.setItem('access_token', newAccessToken);
//     }),
//     catchError(error => {
//       console.error('Error during refresh token request', error);
//       return throwError(() => new Error('Error during refresh token request'));
//     })
//   );
// }


  getRefreshToken(): string | null {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('refresh_token='))
      ?.split('=')[1];
    return token || null;
  }
  
  // isAuthenticated(): Observable<boolean> {
  //     return this.http.get<boolean>(`${this.apiUrl}/is-authenticated`, { withCredentials: true });
  //   }

isAuthenticated(): Observable<{ authenticated: boolean; emailConfirmed: boolean }> {
  return this.http.get<{ authenticated: boolean; userId: string; emailConfirmed: boolean }>(`${this.apiUrl}/is-authenticated`, { withCredentials: true })
    .pipe(
      map(response => {
        if (response.authenticated) {
          sessionStorage.setItem('id_utilisateur', response.userId);
          this.isConnected.next(true);
          this.emailConfirmed.next(response.emailConfirmed);
        } else {
          sessionStorage.removeItem('id_utilisateur');
          this.isConnected.next(false);
          this.emailConfirmed.next(false);
        }
        return { authenticated: response.authenticated, emailConfirmed: response.emailConfirmed };
      }),
      catchError(error => {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        sessionStorage.removeItem('id_utilisateur');
        this.isConnected.next(false);
        this.emailConfirmed.next(false);
        return of({ authenticated: false, emailConfirmed: false });
      })
    );
}


  setEmailConfirmed(value: boolean) {
    this.emailConfirmed.next(value);
  }
}
