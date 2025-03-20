import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from '../service/authent.service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private publicUrls = [
    '/auth/login',
    '/auth/register',
    '/public',
    '/register'
  ];

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
  
    const isPublic = this.publicUrls.some(url => req.url.includes(url));
  
    if (isPublic || !token) {
      return next.handle(req); // Laisser passer les routes publiques
    }
  
    if (this.authService.isTokenExpired()) {
      return this.authService.refreshToken().pipe(
        switchMap((response: { access_token: string }) => {
          const clonedReq = req.clone({
            setHeaders: { Authorization: `Bearer ${response.access_token}` },
          });
          return next.handle(clonedReq);
        }),
        catchError((error) => {
          alert('Votre session a expiré, veuillez vous reconnecter.');
          this.authService.removeToken();
          this.router.navigate(['/login']);
          return throwError(() => new Error('Token expired or invalid'));
        })
      );
    }
  
    // Sinon, ajouter le token normalement
    const clonedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  
    return next.handle(clonedReq);
  }
}
