// src/app/component/reset-password/reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';
  loading = false;
  validating = true;
  tokenInvalid = false;
  tokenExpired = false;
  resetSuccess = false;
  errorMessage = '';
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  
  ngOnInit(): void {
    // Get token from URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      
      if (!this.token) {
        this.tokenInvalid = true;
        this.validating = false;
        return;
      }
      
      // Validate token
      this.authService.validateResetToken(this.token)
        .subscribe({
          next: (result) => {
            if (result.valid) {
              this.tokenInvalid = false;
              this.validating = false;
            } else {
              this.tokenInvalid = true;
              this.validating = false;
            }
          },
          error: () => {
            this.tokenInvalid = true;
            this.validating = false;
          }
        });
    });
  }
  
  get password() { 
    return this.resetPasswordForm.get('password'); 
  }
  
  get confirmPassword() { 
    return this.resetPasswordForm.get('confirmPassword'); 
  }
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  
  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    
    const newPassword = this.password?.value;
    
    if (!newPassword) {
      this.errorMessage = 'Por favor ingresa una contraseña válida.';
      this.loading = false;
      return;
    }
    
    this.authService.resetPassword(this.token, newPassword)
      .subscribe({
        next: () => {
          this.loading = false;
          this.resetSuccess = true;
        },
        error: (error) => {
          this.loading = false;
          
          if (error.status === 400 && error.error?.message?.includes('expired')) {
            this.tokenExpired = true;
          } else {
            this.errorMessage = 'No se pudo restablecer la contraseña. Por favor, intenta nuevamente.';
          }
          
          console.error('Password reset failed:', error);
        }
      });
  }
}