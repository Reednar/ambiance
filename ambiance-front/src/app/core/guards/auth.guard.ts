
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/authent.service';
import { catchError, map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  // Liste des routes autorisées sans email confirmé
  private allowedWithoutEmailConfirmation = ['/profile'];

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated().pipe(
      map(({ authenticated, emailConfirmed, isAdmin }) => {
        if (!authenticated) {
          return this.router.createUrlTree(['/login'], {
            queryParams: { redirectTo: state.url }
          });
        }

        const currentUrl = state.url.split('?')[0];

        // Email non confirmé
        if (authenticated && !emailConfirmed) {
          const isAllowed = this.allowedWithoutEmailConfirmation.includes(currentUrl);
          if (!isAllowed) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Confirmation requise',
              detail: 'Vous devez confirmer votre adresse email pour accéder à cette fonctionnalité.'
            });
            return this.router.createUrlTree(['/']);
          }
        }

        // Protection des routes contenant "moderation" pour les admins uniquement
        if (currentUrl.includes('moderation') && !isAdmin) {
          this.messageService.add({
            severity: 'error',
            summary: 'Accès interdit',
            detail: 'Vous devez être administrateur pour accéder à cette page de modération.'
          });
          return this.router.createUrlTree(['/']);
        }

        return true;
      }),
      catchError(() => {
        return of(this.router.createUrlTree(['/login'], {
          queryParams: { redirectTo: state.url }
        }));
      })
    );
  }
}
