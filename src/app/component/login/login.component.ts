// login.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { GoogleAuthService } from '../../core/services/google-auth.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  activeView: 'login' | 'register' = 'login';
  loading = false;
  errorMessage = '';
  redirectUrl: string | null = null;
  redirectParams: any = {};
  
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  //private googleAuthService = inject(GoogleAuthService);
  
  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
    
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  //ngOnInit(): void {
    // Initialize Google Auth
   // this.googleAuthService.initialize();
    
   ngOnInit(): void {
    // Check current route to determine which view to show
    const currentRoute = this.router.url;
    console.log('Current route:', currentRoute);
    
    if (currentRoute.includes('/register')) {
      this.activeView = 'register';
      console.log('Showing register view based on route');
    } else {
      this.activeView = 'login';
      console.log('Showing login view based on route');
    }
    
    // Check for redirect URL in query params
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirect') || 
                        this.route.snapshot.queryParamMap.get('returnUrl');
    
    console.log('Login component initialized with redirect URL:', this.redirectUrl);
    
    // Store any other query params for later redirect
    this.route.snapshot.queryParamMap.keys.forEach(key => {
      if (key !== 'redirect' && key !== 'returnUrl') {
        this.redirectParams[key] = this.route.snapshot.queryParamMap.get(key);
      }
    });
    
    console.log('Stored redirect params:', this.redirectParams);
  }




  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  
  toggleView(view: 'login' | 'register') {
    this.activeView = view;
    this.errorMessage = '';
  }
  /*
  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    
    this.userService.login(
      this.loginForm.get('email')?.value,
      this.loginForm.get('password')?.value
    ).subscribe({
      next: () => {
        this.redirectAfterAuth();
      },
      error: (error) => {
        console.error('Login failed', error);
        this.loading = false;
        this.errorMessage = 'Credenciales incorrectas. Por favor, inténtelo de nuevo.';
      }
    });
  }
*/


login() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }
  
  this.loading = true;
  this.errorMessage = '';
  
  const loginData = {
    email: this.loginForm.get('email')?.value,
    password: this.loginForm.get('password')?.value
  };
  
  console.log('Submitting login data:', loginData);
  
  this.http.post<any>(`${environment.apiUrl}/auth/login`, loginData)
    .subscribe({
      next: (response) => {
        //console.log('Login successful, server response:', response);
        
        // Make sure we have a proper user object from the response
        if (!response.user) {
          console.error('Login response missing user object:', response);
          this.loading = false;
          this.errorMessage = 'Error en la respuesta del servidor. Por favor, inténtelo de nuevo.';
          return;
        }
        
        // Ensure the user object has an ID and email at minimum
        const user = response.user;
        if (!user._id) {
          user._id = user.id 
         console.log("ERROR NO ID", user)
        }
        
        // Store user and token
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', response.token);
        
        // Update user service
        this.userService.setCurrentUser(user);
        
        //console.log('User stored in localStorage:', JSON.stringify(user));
        //console.log('Token stored in localStorage:', response.token);
        
        // Redirect
        this.redirectAfterAuth();
        this.loading = false;
      },
      error: (error) => {
        //console.error('Login failed', error);
        this.loading = false;
        
        if (error.status === 401) {
          this.errorMessage = 'Credenciales incorrectas. Por favor, inténtelo de nuevo.';
        } else {
          this.errorMessage = 'Error de conexión. Por favor, inténtelo más tarde.';
        }
      }
    });
}
  
  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    
    this.userService.registerUser({
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      fullName: this.registerForm.get('fullName')?.value,
      phone: this.registerForm.get('phone')?.value
    }).subscribe({
      next: () => {
        this.redirectAfterAuth();
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.loading = false;
        
        if (error.status === 409) {
          this.errorMessage = 'Este correo ya está registrado. Por favor, inicie sesión.';
          this.toggleView('login');
          this.loginForm.patchValue({
            email: this.registerForm.get('email')?.value
          });
        } else {
          this.errorMessage = 'No se pudo completar el registro. Por favor, inténtelo de nuevo.';
        }
      }
    });
  }

  /*
  
  loginWithGoogle() {
    this.loading = true;
    this.errorMessage = '';
    
    this.googleAuthService.promptGoogleSignIn().subscribe({
      next: () => {
        // The actual login is handled by the callback in GoogleAuthService
        // Just display loading state for now
      },
      error: (error) => {
        console.error('Google sign-in error', error);
        this.loading = false;
        this.errorMessage = 'No se pudo iniciar sesión con Google. Por favor, inténtelo más tarde.';
      }
    });
  }*/
  
    private redirectAfterAuth() {
      console.log('Redirecting after auth. Redirect URL:', this.redirectUrl);
      console.log('Redirect params:', this.redirectParams);
      
      if (this.redirectUrl) {
        // Convert params to query parameters
        const queryParams: any = {};
        Object.keys(this.redirectParams).forEach(key => {
          queryParams[key] = this.redirectParams[key];
        });
        
        console.log('Navigating to', this.redirectUrl, 'with query params:', queryParams);
        this.router.navigate([this.redirectUrl], { queryParams });
      } else {
        this.router.navigate(['/dashboard']);
      }
    }
}