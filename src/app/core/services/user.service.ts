// user.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../../core/models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  private router = inject(Router);
  
  constructor(private http: HttpClient) {
    // Check for stored user on init
    this.loadStoredUser();
  }
  
  private loadStoredUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
       // console.log('UserService: Found stored user:', user);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('UserService: Error parsing stored user, removing invalid data', e);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      }
    } else {
      //console.log('UserService: No stored user found');
    }
  }
  
  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUserSync(): User | null {
    return this.currentUserSubject.getValue();
  }

    
  setCurrentUser(user: User, token: string): void {
    //console.log('UserService: Setting current user:', user);
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', token);
  }
  
  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map(response => {
          // Store user and token
          const user = response.user;
          const token = response.token;
         // localStorage.setItem('currentUser', JSON.stringify(user));
         // localStorage.setItem('token', response.token);
         this.setCurrentUser(user, token);
          this.currentUserSubject.next(user);
          return user;
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }
  
  logout(): void {
    console.log('UserService: Logging out user');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
     this.router.navigate(['/home']);
  }
  
  
  registerUser(userData: any): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData)
      .pipe(
          map(response => {
            const user = response.user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', response.token);
            this.currentUserSubject.next(user);
            return user;
          }),
          catchError(error => {
            return throwError(() => error);
          })
        );
    }
    
    purchaseCourse(purchaseData: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/purchases`, purchaseData)
        .pipe(
          catchError(error => {
            return throwError(() => error);
          })
        );
    }
    
    submitCompanyPurchase(purchaseData: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/company-purchase`, purchaseData)
        .pipe(
          catchError(error => {
            return throwError(() => error);
          })
        );
    }
    
    getUserPurchases(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/purchases`)
        .pipe(
          catchError(error => {
            return throwError(() => error);
          })
        );
    }
    
    updateUserProfile(userData: Partial<User>): Observable<User> {
      return this.http.put<User>(`${this.apiUrl}/profile`, userData)
        .pipe(
          tap(updatedUser => {
            // Update stored user
            const currentUser = this.currentUserSubject.value;
            if (currentUser) {
              const user = { ...currentUser, ...updatedUser };
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
            }
          }),
          catchError(error => {
            return throwError(() => error);
          })
        );
    }
    
    // For demonstration and development only
    getMockUser(): Observable<User> {
      const mockUser: User = {
        _id: '123',
        email: 'usuario@ejemplo.com',
        fullName: 'Usuario de Prueba',
        phone: '5512345678',
        jobRole: 'Ingeniero de Seguridad',
        companyName: 'Empresa Ejemplo'
      };
      
      return of(mockUser);
    }
  }