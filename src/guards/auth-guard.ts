import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UserService } from '../services/user-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.userService.currentUser$.pipe(
      map(user => {
        if (user) {
          return true; // connecté => accès autorisé
        } else {
          // non connecté => redirige vers la page de connexion
          return this.router.createUrlTree(['/catalog']);
        }
      })
    );
  }
}
