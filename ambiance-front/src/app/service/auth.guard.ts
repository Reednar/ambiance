import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './authent.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      // ❌ Inutile de sauvegarder dans localStorage car on utilise les query params
      // ✅ Rediriger vers login avec le chemin voulu en query param
      return this.router.createUrlTree(['/login'], {
        queryParams: { redirectTo: state.url }
      });
    }
  }
}
