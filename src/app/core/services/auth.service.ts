// src/app/core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private http = inject(HttpClient);
  private userService = inject(UserService);

  /**
   * Login with email and password
   * @param email User email
   * @param password User password
   * @returns Observable with user data
   */
  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        map(response => {
          // Store user and token
          const user = response.user;
          const token = response.token;
          
          // Save user data via UserService
          this.userService.setCurrentUser(user, token);
          
          return user;
        }),
        catchError(error => {
          console.error('Login failed:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Observable with registered user
   */
  registerUser(userData: any): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/users/register`, userData)
      .pipe(
        map(response => {
          const user = response.user;
          const token = response.token || '';
          
          // Save user data via UserService
          if (user && token) {
            this.userService.setCurrentUser(user, token);
          }
          
          return user;
        }),
        catchError(error => {
          console.error('Registration failed:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Request a password reset for the given email address
   * @param email The email address to reset password for
   * @returns Observable with the result of the request
   */
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/password-reset/request`, { email })
      .pipe(
        catchError(error => {
          console.error('Error requesting password reset:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Validate a password reset token
   * @param token The token to validate
   * @returns Observable with the validation result
   */
  validateResetToken(token: string): Observable<{ valid: boolean }> {
    return this.http.post<any>(`${this.apiUrl}/users/password-reset/validate`, { token })
      .pipe(
        catchError(error => {
          console.error('Error validating reset token:', error);
          return of({ valid: false });
        })
      );
  }

  /**
   * Reset password using a valid token
   * @param token The password reset token
   * @param newPassword The new password
   * @returns Observable with the result of the operation
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/password-reset/reset`, { token, newPassword })
      .pipe(
        catchError(error => {
          console.error('Error resetting password:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Update the current user's password
   * @param currentPassword The current password
   * @param newPassword The new password
   * @returns Observable with the result of the operation
   */
  updatePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/password/update`, { 
      currentPassword, 
      newPassword 
    }).pipe(
      catchError(error => {
        console.error('Error updating password:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.userService.logout();
  }
}