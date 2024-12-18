import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if ((state.url == '/login' || state.url == '/register') && localStorage.getItem('username')) {
      this.router.navigate(['dashboard'])
      return false
    }
    if (state.url == '/dashboard' && !localStorage.getItem('username')) {
      this.router.navigate(['login'])
      return false
    }
    return true

  }

}
