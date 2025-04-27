// src/app/core/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.userService.getCurrentUser().pipe(
      take(1),
      map(user => {
        // Check if user is logged in and has admin role
        const isAdmin = !!user && user.roles?.includes('admin');
        
        if (!isAdmin) {
          // Redirect to home page if not admin
          this.router.navigate(['/']);
          return false;
        }
        
        return true;
      })
    );
  }
}