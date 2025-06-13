
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/authent.service';
import { catchError, map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard implements CanActivate {
//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private messageService: MessageService
//   ) { }

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean | UrlTree> {
//     return this.authService.isAuthenticated().pipe(
//       map(({ authenticated, emailConfirmed }) => {
//         if (!authenticated) {
//           // Pas connecté → redirige vers login
//           return this.router.createUrlTree(['/login'], {
//             queryParams: { redirectTo: state.url }
//           });
//         }

//         if (authenticated && !emailConfirmed) {
//           // Connecté mais pas confirmé : afficher message d’alerte
//           this.messageService.add({
//             severity: 'warn',
//             summary: 'Confirmation requise',
//             detail: 'Vous devez confirmer votre adresse email pour accéder à cette fonctionnalité.'
//           });
//           // Bloquer l'accès (redirection possible aussi)
//           // Par exemple on peut rester sur la page d'accueil :
//           return this.router.createUrlTree(['/']);
//           // Ou bloquer sans redirection : return false;
//         }

//         // Connecté et email confirmé → autoriser accès
//         return true;
//       }),
//       catchError(() => {
//         // En cas d'erreur, rediriger vers login
//         return of(this.router.createUrlTree(['/login'], {
//           queryParams: { redirectTo: state.url }
//         }));
//       })
//     );
//   }
// }

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
      map(({ authenticated, emailConfirmed }) => {
        if (!authenticated) {
          return this.router.createUrlTree(['/login'], {
            queryParams: { redirectTo: state.url }
          });
        }

        const currentUrl = state.url.split('?')[0]; // Ignorer les queryParams

        if (authenticated && !emailConfirmed) {
          const isAllowed = this.allowedWithoutEmailConfirmation.includes(currentUrl);
          if (isAllowed) {
            return true;
          }

          this.messageService.add({
            severity: 'warn',
            summary: 'Confirmation requise',
            detail: 'Vous devez confirmer votre adresse email pour accéder à cette fonctionnalité.'
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
