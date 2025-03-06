// google-auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserService } from './user.service';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        }
      }
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private clientId = environment.googleClientId;
  private http = inject(HttpClient);
  private userService = inject(UserService);

  initialize(): void {
    // Load the Google Sign-In script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        this.initializeGoogleSignIn();
      };
    } else {
      this.initializeGoogleSignIn();
    }
  }
  
  private initializeGoogleSignIn(): void {
    window.google?.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => {
        this.handleGoogleSignIn(response);
      },
      auto_select: false
    });
  }
  
  private handleGoogleSignIn(response: any): void {
    const idToken = response.credential;
    
    // Send token to backend for verification and user creation/login
    this.verifyGoogleToken(idToken).subscribe({
      next: (user) => {
        console.log('Successfully logged in with Google', user);
      },
      error: (error) => {
        console.error('Google authentication error', error);
      }
    });
  }
  
  verifyGoogleToken(idToken: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/google`, { idToken })
      .pipe(
        tap((response: any) => {
          // Store user and token
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          
          // Update user in userService
          this.userService.setCurrentUser(response.user);
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }
  
  promptGoogleSignIn(): Observable<any> {
    return new Observable(observer => {
      if (!window.google) {
        observer.error('Google Sign-In not initialized');
        return;
      }
      
      // Configure one-tap prompt
      window.google.accounts.id.prompt();
      
      // This is a bit of a hack since Google's API doesn't provide a Promise/Observable
      // We need to rely on the callback configured in initializeGoogleSignIn
      observer.next('Sign-in prompt displayed');
      observer.complete();
    });
  }
}