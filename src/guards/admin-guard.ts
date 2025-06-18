import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UserService } from '../services/user-service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.userService.currentUser$.pipe(
      map(user => {
        if (user && user.getUserType() === 'admin') {
          return true;
        } else {
          // rediriger ou afficher message "accès refusé"
          return this.router.createUrlTree(['/catalog']);
        }
      })
    );
  }
}
