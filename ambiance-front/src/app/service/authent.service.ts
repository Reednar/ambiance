import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // URL de base de l'API d'authentification (ex: https://monapi.com/auth)
  private apiUrl = `${environment.baseUrl}/auth`;

  // Comportement observable indiquant si l'utilisateur est connecté (true/false)
  private isConnected = new BehaviorSubject<boolean>(false);
  isConnected$ = this.isConnected.asObservable();

  // Comportement observable indiquant si l'email de l'utilisateur est confirmé
  private emailConfirmed = new BehaviorSubject<boolean>(false);
  emailConfirmed$ = this.emailConfirmed.asObservable();

  // constructor(private http: HttpClient, private router: Router) {
  //   // Au démarrage du service, vérifie l'authentification
  //   this.isAuthenticated();
  // }

  constructor(private http: HttpClient, private router: Router) {
    this.isAuthenticated().subscribe(status => {
      // status ici est { authenticated: boolean; emailConfirmed: boolean }
      this.isConnected.next(status.authenticated);
      this.emailConfirmed.next(status.emailConfirmed)
    });
  }

  /**
   * Vérifie si un utilisateur est connecté en vérifiant la validité du token JWT stocké dans les cookies.
   * @returns true si token présent et valide, sinon false
  //  */
  // isLoggedIn(): boolean {
  //   const token = this.getToken();
  //   if (token) {
  //     const parts = token.split('.');
  //     if (parts.length !== 3) {
  //       return false;  // Token invalide (doit avoir 3 parties)
  //     }

  //     try {
  //       const decodedToken: any = jwtDecode(token);
  //       const expirationDate = decodedToken.exp * 1000; // Converti en millisecondes
  //       return expirationDate > Date.now();  // Vrai si non expiré
  //     } catch (error) {
  //       return false;  // Erreur de décodage = token invalide
  //     }
  //   }
  //   return false;  // Pas de token = pas connecté
  // }

  /**
   * Effectue la connexion en envoyant les identifiants (mail + password) au backend.
   * @param credentials Objet contenant mail et password
   * @returns Observable avec succès, id utilisateur et statut confirmation email
   */
  login(credentials: { mail: string; password: string }): Observable<{ success: boolean; userId: string, emailConfirmed: boolean }> {
    const { mail, password } = credentials;
    const user = { mail, password };

    return this.http.post<{ success: boolean; userId: string; emailConfirmed: boolean }>(
      `${this.apiUrl}/login`,
      user,
      { withCredentials: true }  // Nécessaire pour envoyer les cookies de session
    ).pipe(
      tap(response => {
        // Si connexion réussie, on met à jour les états et stocke l'ID utilisateur
        if (response.success) {
          sessionStorage.setItem('id_utilisateur', response.userId);
          this.isConnected.next(true);
          this.emailConfirmed.next(response.emailConfirmed === true);
        }
      }),
      catchError(error => {
        console.error('Erreur de connexion:', error);
        return throwError(() => new Error('Erreur de connexion'));
      })
    );
  }

  /**
   * Récupère le token JWT stocké dans les cookies (cookie 'access_token').
   * @returns Token JWT ou null si absent
   */
  getToken(): string | null {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1];
    return token || null;
  }

  /**
   * Déconnexion : appelle le backend pour terminer la session, puis nettoie les états locaux et redirige vers la page de login.
   * @returns Observable<void>
   */
  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        // Mise à jour des observables et nettoyage local
        this.isConnected.next(false);
        this.emailConfirmed.next(false);
        sessionStorage.removeItem('id_utilisateur');
        console.log("id : " + sessionStorage.getItem('id_utilisateur'))
        this.router.navigate(['/login']);  // Redirection vers login
      }),
      catchError(error => {
        console.error('Erreur lors de la déconnexion:', error);
        return throwError(() => new Error('Erreur de déconnexion'));
      })
    );
  }

  /**
   * Supprime les cookies d'authentification localement (pour forcer la déconnexion côté client).
   */
  removeToken(): void {
    document.cookie = 'access_token=; Max-Age=0; path=/';  // Supprime cookie access_token
    document.cookie = 'refresh_token=; Max-Age=0; path=/'; // Supprime cookie refresh_token
  }

  /**
   * Récupère le refresh token depuis les cookies.
   * @returns Token de refresh ou null si absent
   */
  getRefreshToken(): string | null {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('refresh_token='))
      ?.split('=')[1];
    return token || null;
  }

  /**
   * Vérifie auprès du backend si l'utilisateur est toujours authentifié.
   * Met à jour les observables et le stockage local selon la réponse.
   * @returns Observable indiquant si authentifié et si email confirmé
   */
  isAuthenticated(): Observable<{ authenticated: boolean; emailConfirmed: boolean }> {
    return this.http.get<{ authenticated: boolean; userId: string; emailConfirmed: boolean }>(
      `${this.apiUrl}/is-authenticated`,
      { withCredentials: true }
    ).pipe(
      map(response => {
        if (response.authenticated) {
          // Stocke l'id utilisateur et met à jour les états
          sessionStorage.setItem('id_utilisateur', response.userId);
          this.isConnected.next(true);
          this.emailConfirmed.next(response.emailConfirmed);
        } else {
          // Nettoyage si non authentifié
          sessionStorage.removeItem('id_utilisateur');
          this.isConnected.next(false);
          this.emailConfirmed.next(false);
        }
        return { authenticated: response.authenticated, emailConfirmed: response.emailConfirmed };
      }),
      catchError(error => {
        // En cas d'erreur, considère que l'utilisateur n'est pas authentifié
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        sessionStorage.removeItem('id_utilisateur');
        this.isConnected.next(false);
        this.emailConfirmed.next(false);
        return of({ authenticated: false, emailConfirmed: false });
      })
    );
  }
}
