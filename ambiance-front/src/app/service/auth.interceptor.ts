// import { Injectable } from '@angular/core';
// import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, switchMap } from 'rxjs/operators';
// import { AuthService } from '../service/authent.service';
// import { Router } from '@angular/router';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {

//   constructor(private authService: AuthService, private router: Router) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // Liste des URLs publiques à exclure (par exemple /auth/login)
//     const publicUrls = ['/auth/login', '/auth/register', '/auth', '/auth/is-authenticated'];

//     // Vérifier si l'URL de la requête fait partie des URLs publiques
//     if (publicUrls.some(url => req.url.includes(url))) {
//       return next.handle(req); // Ne pas ajouter le token pour ces requêtes
//     }

//     // Ajouter le token pour les autres requêtes
//     const token = this.authService.getToken();
//     const clonedRequest = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

//     return next.handle(clonedRequest).pipe(
//       catchError((error: HttpErrorResponse) => {
//         console.error('Erreur de requête:', error);
//         if (error.status === 401) {
//           return this.authService.refreshToken().pipe(
//             switchMap((newTokenResponse: { access_token: string }) => {
//               const newRequest = clonedRequest.clone({
//                 setHeaders: { Authorization: `Bearer ${newTokenResponse.access_token}` }
//               });
//               return next.handle(newRequest);
//             }),
//             catchError((refreshError) => {
//               this.authService.logout();
//               return throwError(() => refreshError);
//             })
//           );
//         }
//         return throwError(() => error);
//       })
//     );
//   }
// }
