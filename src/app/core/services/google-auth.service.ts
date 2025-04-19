// google-auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private clientId = environment.googleClientId;
  private http = inject(HttpClient);
  private userService = inject(UserService);
  
  initialize(): void {
    console.log('Loading Google Sign-In script...');
    if (!document.getElementById('google-signin-script')) {
      const script = document.createElement('script');
      script.id = 'google-signin-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Sign-In script loaded');
        this.initializeGoogleSignIn();
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Sign-In script');
      };
      
      document.head.appendChild(script);
    } else {
      console.log('Google Sign-In script already loaded');
      this.initializeGoogleSignIn();
    }
  }
  
  private initializeGoogleSignIn(): void {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      console.error('Google Sign-In API not available');
      return;
    }
    
    console.log('Initializing Google Sign-In with client ID:', this.clientId);
    
    try {
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true
      });
      console.log('Google Sign-In initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Sign-In:', error);
    }
  }
  
  private handleCredentialResponse(response: any): void {
    console.log('Google credential response received:', response);
    
    if (!response || !response.credential) {
      console.error('Invalid response from Google Sign-In');
      return;
    }
    
    const idToken = response.credential;
    console.log('Google ID token received, sending to backend...');
    
    // Send the token to your backend
    this.verifyGoogleToken(idToken).subscribe({
      next: (userData) => {
        console.log('Successfully verified Google token with backend:', userData);
      },
      error: (error) => {
        console.error('Failed to verify Google token with backend:', error);
      }
    });
  }
  
  promptGoogleSignIn(): Observable<void> {
    return new Observable(observer => {
      console.log('Displaying Google Sign-In prompt');
      
      if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        const error = new Error('Google Sign-In not initialized');
        console.error(error);
        observer.error(error);
        return;
      }
      
      try {
        window.google.accounts.id.prompt((notification: any) => {
          console.log('Google Sign-In prompt notification:', notification);
          
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.warn('Google Sign-In prompt not displayed or skipped:', 
                        notification.getNotDisplayedReason() || notification.getSkippedReason());
            observer.error(new Error('Google Sign-In prompt not displayed'));
          } else if (notification.isDismissedMoment()) {
            console.warn('Google Sign-In prompt dismissed:', notification.getDismissedReason());
            observer.error(new Error('Google Sign-In prompt dismissed'));
          } else {
            observer.next();
            observer.complete();
          }
        });
      } catch (error) {
        console.error('Error displaying Google Sign-In prompt:', error);
        observer.error(error);
      }
    });
  }
  
  verifyGoogleToken(idToken: string): Observable<any> {
    console.log('Verifying Google token with backend API...');
    
    // First check which endpoint to use by trying to detect which one exists
    return this.http.options(`${environment.apiUrl}/auth/google/token`).pipe(
      catchError(error => {
        console.log('Token endpoint check failed, trying alternative endpoint');
        return of(null);
      }),
      switchMap(response => {
        const endpoint = response ? 
          `${environment.apiUrl}/auth/google/token` : 
          `${environment.apiUrl}/auth/google`;
          
        const payload = response ? { token: idToken } : { idToken };
        
        console.log(`Using endpoint: ${endpoint} with payload:`, payload);
        
        return this.http.post(endpoint, payload).pipe(
          tap((response: any) => {
            console.log('Backend response:', response);
            if (response.user && response.token) {
              localStorage.setItem('currentUser', JSON.stringify(response.user));
              localStorage.setItem('token', response.token);
              this.userService.setCurrentUser(response.user,localStorage.getItem('token') || '');
            }
          }),
          catchError(error => {
            console.error('Backend verification error:', error);
            return throwError(() => error);
          })
        );
      })
    );
  }
}
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
        }
      }
    }
  }
}
export {}