import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './authent.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated().pipe(
      map((authenticated: boolean) => {  // Change la signature de la réponse à boolean
        if (authenticated) {
          // Si l'utilisateur est authentifié
          return true; // Autoriser l'accès à la route
        } else {
          // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
          return this.router.createUrlTree(['/login'], {
            queryParams: { redirectTo: state.url }
          });
        }
      }),
      catchError(() => {
        // En cas d'erreur, redirige vers la page de connexion
        return of(this.router.createUrlTree(['/login'], {
          queryParams: { redirectTo: state.url }
        }));
      })
    );
  }
}